/**
 * controller logic for reporting stuff
 */
'use strict';

var RaspBeat = require('../models/raspbeat');
var utils = require('../util/utils');

/**
 * simple controller, just redirect to the html UI frontend
 * @param req
 * @param res
 */
exports.index = function(req, res) {
  console.log('redirect to UI logic now!');
  res.redirect('/app');
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

    console.log(filter);

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

    return res.status(500).send('Cannot receive beat! ' + err);
  }
};
