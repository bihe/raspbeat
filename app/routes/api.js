/*
 * define the routes to the handling controllers
 * api.js created by Henrik Binggl
 */
'use strict';

var express = require('express');
var router = express.Router();
var apiCtrl = require('../controllers/apicontroller');

// setup the routes and delegate logic to the controllers
// --------------------------------------------------------------------------
router.post('/beat', apiCtrl.beat);

module.exports = router;
