/*
 * application configuration file
 */
var config = {};


config.application = {};
config.application.basePath = '/';
config.application.secret = '--SECRET--';
config.application.store = './store';
config.application.timespandown = 13;

config.application.tokens = ['--TOKEN--1', '--TOKEN--2'];

config.sso = {};
config.sso.returnUrl = '--RETURN--URL--';
config.sso.secret = '--SECRET--';
config.sso.cookie = 'login_token';
config.sso.errorUrl = 'https://login.binggl.net/403'; 
config.sso.url = 'https://login.binggl.net/auth/flow?';
config.sso.site = 'raspbeat';
config.sso.siteparam = '~site=';
config.sso.urlparam = '~url=';

module.exports = config;