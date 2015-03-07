/**
 * Created by henrik on 07.03.2015.
 */
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var TokenService = require('../app/services/tokenService');

describe('ServiceTests', function() {
  describe('TokenService', function() {
    it('should parse a provided token', function() {

      // mock request, response
      var req, res, next, nextSpy, tokenSvc;
      tokenSvc = new TokenService(['token1', 'token2']);

      req = {
        header: function(name) { return 'Bearer token1'; }
      };
      res = {
        send: function(){ return this; },
        status: function(responseStatus) {
          return this;
        }
      };
      nextSpy = next = sinon.spy();

      tokenSvc.verifyToken(req, res, next);
      assert(nextSpy.calledOnce);

    });
  });
});