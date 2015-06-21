/*
 * base ui routes
 * ui.js created by Henrik Binggl
 */
'use strict';

var express = require('express');
var router = express.Router();
var appCtrl = require('../controllers/uicontroller');

// setup the routes and delegate logic to the controllers
// --------------------------------------------------------------------------
router.get('/overviewBeats', appCtrl.getBeatsOverview);
router.get('/beats', appCtrl.getBeats);
router.get('/sumBeats', appCtrl.getSumBeats);
router.get('/user', appCtrl.user);

router.delete('/remove/:title/:ip', appCtrl.deleteBeat);

module.exports = router;
