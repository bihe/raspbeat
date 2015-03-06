/**
 * api controller logic
 */
'use strict';

var RaspBeat = require('../models/raspbeat');
var log = require('../util/logger');

/**
 * the controller receives the beat payload and stores it in the backend
 *
 * the palyload is the given JSON object
 *
 * {
 *   title: 'string',
 *   ip: 'string',
 *   localTimestamp: 'datetime',
 *   load: 'string'
 * }
 *
 * @param req
 * @param res
 */
exports.beat = function(req, res) {
  var payload = '',
    beat;

  console.log('get a beat from a given raspberry');

  try {

    // TODO: check for given token - if the 'bearer' is not available return error
    payload = req.body;
    console.log('got payload');
    log.dump(payload);

    beat = new RaspBeat({title: payload.title,
      ip: payload.ip,
      localTimestamp: payload.localTimestamp,
      load: payload.load
    });
    
    beat.save(function(err, b) {
      if(err) {
        console.log('could not save the beat: ' + err);
        return res.status(500).send('Cannot save beat! ' + err);
      }

      if(!b) {
        console.log('could not save the beat - beat is null!');
        return res.status(500).send('Cannot save beat - beat is null!');
      }

      console.log('Beat was saved ' + b.toString());
      return res.status(200).send('Beat saved (' + b.alternativeId + ')!');
    });

  } catch (err) {
    console.log('Got error: ' + err);
    console.log(err.stack);

    return res.status(500).send('Cannot receive beat! ' + err);
  }
};
