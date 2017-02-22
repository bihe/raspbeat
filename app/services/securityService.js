'use strict';

/**
 * @author Henrik Binggl
 *
 */

var logger = require('../util/logger')
  , appConfig = require('../config/application')
  , jwt = require('jsonwebtoken')
  , _ = require('lodash');

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
      var cookies = req.cookies;
       
      if(req.session.authenticated === true && cookies[appConfig.sso.cookie] 
      && !_.isEmpty(cookies[appConfig.sso.cookie])) {
        // is authenicated and a cookie value is available
        // but skip the verification
        return next();
      }
      
      if(cookies[appConfig.sso.cookie] && !_.isEmpty(cookies[appConfig.sso.cookie])) {
        var token = cookies[appConfig.sso.cookie];  
        // this is a JWT token - verify the token
        jwt.verify(token, appConfig.sso.secret, function(err, decoded) {
          if(err) {
            console.log('Could not verify token: ' + err);
            return res.redirect(appConfig.sso.errorUrl);
          }
          if(decoded.Claims && decoded.Claims.length > 0) {
            var claim = null;
            var index = _.findIndex(decoded.Claims, function(entry) {
              // entry syntax: name|url|role
              var entries = entry.split('|');
              if(entries && entries.length == 3) {
                if(entries[0] === appConfig.sso.site) {
                  claim = {};
                  claim.role = entries[2];
                  claim.name = entries[0];
                  claim.url = entries[1];
                  return true;
                }
              }
              return false;
            });
            
            if(claim && index > -1) {
              req.user = {};
              req.user.username = decoded.UserName;
              req.user.displayName = decoded.DisplayName;
              req.user.email = decoded.Email;
              req.user.id = decoded.UserId;
              req.user.claim = claim;
              
              req.session.authenticated = true;
              req.session.user = req.user;
              
              return next();  
            }
          } 
          console.log('No Claims available!');
          return res.redirect(appConfig.sso.errorUrl);       
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
        
        res.render('login', { loginUrl: redirectUrl } );
         
        //res.redirect(redirectUrl);
      }
    }
  };
})();

module.exports = SecurityService;