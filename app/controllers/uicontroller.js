/**
 * controller logic for reporting stuff
 */
'use strict';

var moment = require('moment');
var _ = require('lodash');
var utils = require('../util/utils');
var logger = require('../util/logger');
var config = require('../config/application');
var BeatService = require('../services/beatService');

/**
 * simple controller, just redirect to the html UI frontend
 * @param req
 * @param res
 */
exports.index = function(req, res) {
  console.log('redirect to UI logic now!');
  res.redirect('/ui');
};

/**
 * get user profile
 * @param req
 * @param res
 */
exports.user = function(req, res) {
  if(req.session.user) {
    return res.json(req.session.user);
  }
  return res.status(400).send('Cannot find user!');
};

/**
 * basic error handling
 * @param req
 * @param res
 * @param next
 * @param err
 * @returns {*}
 */
exports.handleError = function( req, res, next, err ) {
  console.error('An error occured: ' + err.message);
  console.error('Stack: ' + err.stack);

  return next(err);
};

/**
 * get a list of available beat entries - categoriesed by title
 * @param req
 * @param res
 */
exports.getBeatsOverview = function(req, res) {
  var service = new BeatService();
  console.log('get beats categorised');
  try {
    service.getBeatsOverview().then(function(groupedBeats) {
      // iterate over the grouped beats and find out if the beat
      // is older than a given timespan
      _.forEach(groupedBeats, function(elem) {
        elem.timeIsOver = moment(elem.lastEntry).add(config.application.timespandown, 'h').isBefore();
      });

      return res.json(groupedBeats);

     }).catch(function(error) {
      console.log(error.stack);
      return res.status(500).send('Cannot return beats! ' + error);
    })
    .done();
  } catch (err) {
    console.log('Got error: ' + err);
    console.log(err.stack);

    return res.status(500).send('Cannot get beat categories! ' + err);
  }
};

/**
 * get the sum of beats and senders
 * @param req
 * @param res
 */
exports.getSumBeats = function(req, res) {
  try {

    var service = new BeatService();
    var result = {};
    
    service.getBeatsStatistics().then(function(statistics) {

      result.senders = statistics.hosts;
      result.entries = statistics.beats;

      return res.json(result);

    }).catch(function(error) {
      console.log(error.stack);
      return res.status(500).send('Cannot get beat statistics! ' + error);
    })
    .done();

  } catch (err) {
    console.log('Got error: ' + err);
    console.log(err.stack);

    return res.status(500).send('Cannot get beat sums! ' + err);
  }
};

/**
 * delete beat entries defined by title and ip
 * @param req
 * @param res
 */
exports.deleteBeat = function(req, res) {
  var title = req.params.title;
  var ip = req.params.ip;
  var service = new BeatService();

  try {
    console.log('Will remove entry ' + title + ' / ' + ip);

    service.deleteBeatSync(title);
    return res.status(200).send('Entry deleted');

  } catch(err) {
    console.log('Got error: ' + err);
    console.log(err.stack);
    return res.status(500).send('Cannot delete entries! ' + err);
  }
};
