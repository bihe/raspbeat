/**
 * api controller logic
 */
'use strict';

var log = require('../util/logger');
var BeatService = require('../services/beatService');

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

exports.beat = function (req, res) {
  var payload = '', beat, service = new BeatService();

  console.log('get a beat from a given raspberry');

  try {

    payload = req.body;
    console.log('got payload');
    log.dump(payload);

    beat = {
      title: payload.title,
      ip: payload.ip,
      localTimestamp: payload.localTimestamp,
      load: payload.load
    };

    console.log(beat);

    service.saveBeat(beat).then(function(filePath) {
      console.log('Beat saved!');

      return res.status(200).send('Beat saved (' + filePath + ').');

    }).catch(function(error) {
      console.log(error.stack);
      return res.status(500).send('Cannot save beat! ' + error);
    })
    .done();

  } catch (err) {
    console.log('Got error: ' + err);
    console.log(err.stack);

    return res.status(500).send('Cannot receive beat! ' + err);
  }
};
