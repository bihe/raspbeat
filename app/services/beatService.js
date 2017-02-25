'use strict';

var _ = require('lodash');
var q = require('q');
var fs = require('fs');
var path = require('path');
var config = require('../config/application');
var randomstring = require('randomstring');
var crypto = require('crypto');
var recursive = require('recursive-readdir');
var async = require('async');

/**
 * @constructor
 */
function BeatService() {
}

/*
 * method, logic implementation
 */
BeatService.prototype = (function() {

  // private section

  var sanitizeTitle = function(title) {
    return crypto.createHash('md5').update(title).digest('hex');
  }

  var getNewestFile = function(dir, files, cb) {
    if (!cb) return;
    if (!files || (files && files.length === 0)) {
        return cb();
    }

    if(!dir.endsWith(path.sep)) {
      dir += path.sep;
    }

    async.waterfall([
      function(callback) {
        var fileStats = [];
        async.each(files, function(file, eachCallback) {
          fs.stat(dir + file, function(err, stats) {
            if(err) {
              return eachCallback(err);
            }
            fileStats.push({file: file, mtime: stats.mtime.getTime()});
            eachCallback();
          });
        }, function(error) {
          if(error) {
            return callback(error);
          }
          callback(null, fileStats);
        });
      },
      function(fileStats, callback) {
        var max = 0;
        var lastFile = '';
        fileStats.forEach(function(item) {
          if(item.mtime > max) {
            max = item.mtime;
            lastFile = item.file;
          }
        });
        callback(null, { file: lastFile, time: max });
      }
    ], function(error, result) {
        if(error) {
          console.log(error);
          return cb();
        }
        cb(result);
      }
    );   
  }

  var deleteFolderRecursiveSync = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
      files = fs.readdirSync(path);
      files.forEach(function(file){
          var curPath = path + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursiveSync(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
    }
  }

  // public section
  return {

    saveBeat: function(beat) {
      var deferred = q.defer();
      var path = config.application.store + '/' + sanitizeTitle(beat.title);
      var id = randomstring.generate(16);
      var filePath = path + '/' + id + '.json';
      var payload;

      // we will create a directory for each beat.title
      fs.mkdir(path, function(err) {
        if (err) {
          if (err.code != 'EEXIST') {
            return deferred.reject(err);  
          }
        } 

        console.log('Will write file: ' + filePath);

        payload = JSON.stringify(beat);

        // store the beat in the folder
        fs.writeFile(filePath, payload, function(err) {
          if(err) {
            return deferred.reject(err);  
          }

          return deferred.resolve(filePath);
        });
      });

      return deferred.promise;  
    },

    getBeatsStatistics: function() {
      var deferred = q.defer();
      var path = config.application.store;
      
      var statistics = {};
      statistics.hosts = 0;
      statistics.beats = 0;
      
      async.series(
        [
          function(callback) {
            fs.readdir(path, function(err, files) {
              if(err) {
                return callback(err);
              }

              async.each(files, function(file, eachCallback) {
                fs.stat(path + '/' + file, function(err, stats) {
                  if(err) {
                    return callback(err);
                  }
                  if(stats.isDirectory()) {
                    statistics.hosts += 1;
                  }
                  eachCallback();
                });
              }, function(error) {
                if(error) {
                  return callback(error);
                }
                callback(null);
              });
            });
          },
          function(callback) {
            recursive(path, function (err, files) {
              if(err) {
                return callback(err);
              }
              files.forEach(function(file, index) {
                if(file.endsWith('json')) {
                  statistics.beats += 1;
                }
                if(index === files.length -1) {
                  callback(null);
                }
              });
            });
          }
        ],
        function(error) {
          if(error) {
            return deferred.reject(error);
          }
          return deferred.resolve(statistics);
        }
      );

      return deferred.promise;  
    },

    getBeatsOverview: function() {
      var deferred = q.defer();
      var dir = config.application.store;
      var groupedBeats = [];

      async.waterfall(
        [
          function(callback) {
            var directories = [];

            fs.readdir(dir, function(err, files) {
              if(err) {
                return callback(err);
              }

              files.forEach(function(file, index) {
                fs.stat(dir + '/' + file, function(err, stats) {
                  if(err) {
                    return callback(err);
                  }
                  if(stats.isDirectory()) {
                    directories.push(dir + '/' + file);
                  }
                  if(index === files.length -1) {
                    callback(null, directories);
                  }
                });
              });
            });
          },
          function(directories, callback) {
            async.each(directories, function(directory, eachCallback) {
              fs.readdir(directory, function(error, files) {
                if(error) {
                  return eachCallback(error);
                }
                getNewestFile(directory, files, function(newest) {
                  if(!directory.endsWith(path.sep)) {
                    directory += path.sep;
                  }
                  if(newest) {
                    fs.readFile(directory + newest.file, 'utf8', function (err, data) {
                      if (err) {
                        eachCallback(err);
                      }
                      var object = JSON.parse(data);
                      groupedBeats.push({
                        _id: {
                          title: object.title,
                          id: object.id,
                          ip: object.ip
                        },
                        title: object.title, 
                        ip: object.ip, 
                        count: files.length, 
                        lastEntry: new Date(newest.time).toISOString() 
                      });
                      eachCallback();
                    });
                  } else {
                    eachCallback();
                  }
                });
              });
            }, function(error) {
              if(error) {
                return callback(error);
              }
              callback(null, groupedBeats);
            });
          }
        ],
        function(error) {
          if(error) {
            return deferred.reject(error);
          }
          return deferred.resolve(groupedBeats);
        }
      );

      return deferred.promise;
    },

    deleteBeatSync: function(title) {
      var path = config.application.store + '/' + sanitizeTitle(title);
      deleteFolderRecursiveSync(path);
    }
  };

})();

module.exports = BeatService;
