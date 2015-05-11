/**
 * Created by henrik on 07.03.2015.
 */
'use strict';

var _ = require('lodash');

/**
 * @constructor
 */
function TokenService(tokensToCheck) {
  this.tokens = tokensToCheck
}

/*
 * method, logic implementation
 */
TokenService.prototype = (function() {

  // private section

  // public section
  return {

    /**
     * check the header in the request and match it with the valid tokens
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    verifyToken: function(req, res, next) {
      var bearer, token, procede = false, self = {};
      self = this;
      try {
        // e.g. Authorization: Bearer mF_9.B5f-4.1JqM
        bearer = req.header('Authorization');
        if(!bearer) {
          return res.status(403).send('Missing authorization!');
        }

        // parse the bearer token
        token = bearer.replace('Bearer ', '');
        if(!token) {
          return res.status(403).send('Missing authorization token!');
        }

        // lookup the token
        _.forEach(self.tokens, function(t) {
          if(t === token) {
            console.log('Found the token!');
            procede = true;
            return false;
          }
        });
        if(procede) {
          next();
          return;
        }

        return res.status(403).send('Authorization token does not match!');

      } catch(err) {
        console.log('Got error: ' + err);
        console.log(err.stack);

        return res.status(500).send('Cannot check header! ' + err);
      }
    }
  };

})();

module.exports = TokenService;
