'use strict';

/**
 * @author Henrik Binggl
 *
 */

var UserService = require('./userService')
  , logger = require('../util/logger')
  , appConfig = require('../config/application')
  , jwt = require('jsonwebtoken')
  ;

/**
 * @constructor
 */
function SecurityService() {
}

/*
 * SecurityService implements necessary methods for passport
 * authentication logic
 */
SecurityService.prototype = (function() {

  // private section

  // public section
  return {

    /**
     * Simple route middleware to ensure user is authenticated
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    authRequired: function(req, res, next) {
      /* we need a JWT token as a cookie to procede with the logic
       * if the cookie is not available redirect to the external
       * SSO service login.binggl.net with the current path as
       * a parameter
       */
      if(req.session.authenticated === true) {
        return next();
      }
      var cookies = req.cookies;
      if(cookies[appConfig.sso.cookie]) {
        var token = cookies[appConfig.sso.cookie];
        // this is a JWT token - verify the token
        jwt.verify(token, appConfig.sso.secret, function(err, decoded) {
          if(err) {
            console.log('Could not verify token: ' + err);
            return res.redirect(appConfig.sso.errorUrl);
          }
          
          console.log('Could decode the token!');
          console.log('Find the user by the ')
          
          req.user = {};
          req.user.username = decoded.UserName;
          req.user.displayName = decoded.DisplayName;
          req.user.email = decoded.Email;
          req.user.id = decoded.UserId;
          req.user.claims = decoded.Claims;
          
          req.session.authenticated = true;
          req.session.user = req.user;
          
          return next();  
        });
        
      } else {
        req.session.authenticated = false;
        // no cookie availalbe - redirect to the authentication system
        var redirectUrl = appConfig.sso.url 
          + appConfig.sso.siteparam 
          + appConfig.sso.site 
          + '&' 
          + appConfig.sso.urlparam 
          + appConfig.sso.returnUrl;
          
        console.log('Will send auth request to ' + redirectUrl); 
        res.redirect(redirectUrl);
      }
    },

    /**
     * To support persistent login sessions, Passport needs to be able to
     * serialize users into and deserialize users out of the session.
     * @param user
     * @param callback
     */
    serializeUser: function(user, callback) {
      // simple logic, just use the id of the user!
      callback(null, user._id);
    },

    /**
     * deserialize the user from the session
     * @param obj
     * @param callback
     */
    deserializeUser: function(obj, callback) {
      // just return the id
      callback(null, obj);

      /* rather resource hungry, only load the user when needed!

      // in the session the user-id was serialized
      // use the id to load the user again
      var userService = new UserService();
      userService.findUserById(obj).then(function(user) {
        callback(null, user);
      }).catch(function(error) {
        console.error('Could not find the user! ' + error);
        callback(error, null);
      }).done();

      */
    }
  };

})();

module.exports = SecurityService;
