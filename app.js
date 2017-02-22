/**
 * Module dependencies.
 */

'use strict';

var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('cookie-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var flash = require('connect-flash');

var routes = require('./app/routes');
var uiRoutes = require('./app/routes/ui');
var apiRoutes = require('./app/routes/api');
var config = require('./app/config/application');
var TokenService = require('./app/services/tokenService');
var SecurityService = require('./app/services/securityService');

var app = express();
var env = app.get('env') || 'development';
var tokenSvc = new TokenService(config.application.tokens);


// --------------------------------------------------------------------------
// Passport setup
// --------------------------------------------------------------------------
var secService = new SecurityService();

// --------------------------------------------------------------------------
// Application setup
// --------------------------------------------------------------------------

// server settings
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || '127.0.0.1');

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({name: 'raspbeat', secret: config.application.secret}));
app.use(flash());
app.use(cookieParser(config.application.secret));

if(env === 'development') {
  app.use('/ui/', /*secService.authRequired,*/ express.static(path.join(__dirname, 'ui'), {maxAge: '5d'}));
  app.use(favicon(__dirname + '/ui/html5.ico'));
} else if(env === 'production') {
  app.use('/ui/', secService.authRequired, express.static(path.join(__dirname, 'ui/dist'), {maxAge: '5d'}));
  app.use(favicon(__dirname + '/ui/dist/html5.ico'));
}
app.disable('x-powered-by');
app.enable('trust proxy');

// view settings
app.locals.basePath = config.application.basePath;

// --------------------------------------------------------------------------
// Route handling
// --------------------------------------------------------------------------
app.use('/api/receiver', tokenSvc.verifyToken.bind(tokenSvc), apiRoutes);

// active CSRF for other urls
app.use(csrf());

// --------------------------------------------------------------------------
// CSRF handling with angular
// --------------------------------------------------------------------------

app.use(function(req, res, next) {

  if(!req.session.currentToken) {
    try {
      if (typeof req.csrfToken === 'function') {
        var csrfToken = req.csrfToken();
        res.cookie('XSRF-TOKEN', csrfToken);
        req.session.currentToken = csrfToken;
      }
    } catch(err) {
      console.log('CSRF error ' + err);
    }
  }
  next();
});

app.use('/api/ui', secService.authRequired, uiRoutes);
app.use('/', secService.authRequired, routes);

// --------------------------------------------------------------------------
// Error handling
// --------------------------------------------------------------------------

// development error handler
// will print stacktrace
if (env === 'development') {
  app.enable('error-stack'); // display the error stack in development

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });
}

// 404 handler with content type specific results
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// --------------------------------------------------------------------------
// finally the HTTP server
// --------------------------------------------------------------------------

http.createServer(app).listen(app.get('port'), app.get('host'),  function(){
  console.log('node.app is run in mode [' + env + ']');
  console.log('Express listening on ' + app.get('host') + ':' + app.get('port'));
});
