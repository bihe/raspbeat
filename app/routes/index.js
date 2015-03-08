/*
 * base routes
 * index.js created by Henrik Binggl
 */
'use strict';

var express = require('express');
var router = express.Router();
var appCtrl = require('../controllers/uicontroller');

// setup the routes and delegate logic to the controllers
// --------------------------------------------------------------------------
router.get('/', appCtrl.index);
router.get('/overviewBeats', appCtrl.getBeatsOverview);
router.get('/beats', appCtrl.getBeats);

module.exports = router;
