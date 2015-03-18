/**
 * controller logic for reporting stuff
 */
'use strict';

var moment = require('moment');
var _ = require('lodash');
var RaspBeat = require('../models/raspbeat');
var utils = require('../util/utils');
var logger = require('../util/logger');
var UserService = require('../services/userService');
var config = require('../config/application');

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
 * show the login form
 * @param req
 * @param res
 */
exports.login = function(req, res) {
  res.locals.errors = req.flash();
  console.log(res.locals.errors);
  res.render('login', { messages: res.locals.errors });
};

/**
 * perform a logout
 * @param req
 * @param res
 */
exports.logout = function(req, res) {
  var result = {};
  result.success = true;
  try {
    req.logout();
    res.render('login', { messages: { info: 'User logged out!' }});
    return;
  } catch(error) {
    result.success = false;
    result.error = error;
  }
  res.json(result);
};

/**
 * get user profile
 * @param req
 * @param res
 */
exports.user = function(req, res) {
  var userService = new UserService();
  userService.findUserById(req.user).then(function(user) {
    var viewModel = {};
    viewModel.thumb = user.thumb;
    viewModel.displayName = user.displayName;
    viewModel.email = user.email;

    res.json(viewModel);
  }).catch(function(error) {

    console.log(error.stack);
    return res.status(400).send('Cannot find user! ' + error);
  }).done();
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
 * get a list of beats between two timestamps for a specific raspberry
 * @param req
 * @param res
 */
exports.getBeats = function(req, res) {

  console.log('get beats between given dates');

  try {

    var filter = {}, filterValue, logicalAnd = [];

    if(req.query.title) {
      filter = {};
      filter.title = req.query.title;
      logicalAnd.push(filter);
    } else {
      console.log('need a title to query data!');
      res.status(400).send('Need a title to query data!');
      return;
    }


    if(req.query.df) {
      filterValue = req.query.df;
      filter = {};
      filter.created = {};
      filter.created.$gte = utils.parseDate(filterValue, false);
      logicalAnd.push(filter);
    }
    if(req.query.dt) {
      filterValue = req.query.dt;
      filter = {};
      filter.created = {};
      filter.created.$lte = utils.parseDate(filterValue, true);
      logicalAnd.push(filter);
    }
    // combine the filters
    if(logicalAnd.length > 1) {
      filter = {};
      filter.$and = logicalAnd;
    } else if(logicalAnd.length == 1) {
      filter = logicalAnd[0];
    } else {
      console.log('No filters supplied!');
      res.json([]);
      return;
    }
    logger.dump(filter);

    RaspBeat.find(filter).sort({created: -1, title: 1})
      .exec(function(err,beats) {
        if(err) {
          return res.status(500).send('Cannot return beats! ' + err);
        }
        res.json(beats);
      });


  } catch (err) {
    console.log('Got error: ' + err);
    console.log(err.stack);

    return res.status(500).send('Cannot get beats! ' + err);
  }
};

/**
 * get a list of available beat entries - categoriesed by title
 * @param req
 * @param res
 */
exports.getBeatsOverview = function(req, res) {

  console.log('get beats categorised');

  try {

    // define the grouping
    var filter = {
      $group : {
        _id : { title: "$title", ip: "$ip"},
        count: { $sum: 1 },
        lastEntry: {$last: "$created"}
      }
    };
    var order = {
      $sort : {
        _id : 1
      }
    }

    RaspBeat.aggregate(filter, order,
      function (err, groupedBeats) {
        if (err) {
          return res.status(500).send('Cannot return beats! ' + err);
        }

        // iterate over the grouped beats and find out if the beat
        // is older than a given timespan
        _.forEach(groupedBeats, function(elem) {
          elem.timeIsOver = moment(elem.lastEntry).add(config.application.timespandown, 'h').isBefore();
        });

        return res.json(groupedBeats);
      }
    );

  } catch (err) {
    console.log('Got error: ' + err);
    console.log(err.stack);

    return res.status(500).send('Cannot get beat categories! ' + err);
  }
};
