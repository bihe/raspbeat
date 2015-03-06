/**
 * controller logic for reporting stuff
 */
'use strict';

/**
 * simple controller, just redirect to the html UI frontend
 * @param req
 * @param res
 */
exports.index = function(req, res) {
  console.log('redirect to UI logic now!');
  res.redirect('/app');
};
