var path = require('path');
var express = require('express');

require('express-namespace');
var server = express();

var serverBase = path.resolve(__dirname, '../');
server.set('serverBase', serverBase);

// very loud!
if (process.env.ENABLE_LOGGING) {
  server.use(express.logger('dev')); // only log dynamic routes
}

server.use(express.bodyParser());

// Must be required before all other routes
require('./static-routes')(server);
require('./app-routes')(server);

/**
 * Dev Express Server / Middleware Stack
 *
 * Build a dev server w/ routes using express(expressjs.com)
 *
 * Require each route below. When you run `grunt`(or a related development
 * grunt task) connect will boot a server at localhost:8000 and
 * the routes will be avialable for use in your app
 *
 * If a required module needs to use the `server` object instantiated
 * in this file, make sure to pass `server` as an argument to the requried
 * module, and make sure the module exports a function(that takes one arg)
 *
 * @see  api/app-routes for an example
 *
 * To prevent namespace collisions use the namespace module (installed by default)
 * to namespace portions of your api, thereby preventing collisions(and odd behavior)
 *
 * Do not create a namespace named public, test, bower_components or js as those
 * are already used by your app(to serve the directories it uses)
 *
 * Example:
 *
 *   // api/some-api-namespace.js
 *   module.exports = function(server) {
 *     server.namespace('/some-api-namespace', function() {
 *       server.get('/some-route', function(req, res) {
 *         // do stuff
 *         req.send(res);
 *       })
 *     })
 *   }
 *
 *   // api/server.js (this file)
 *   require('./some-api-namespace')(server);
 *
 *   // In your app you can now visit
 *   // localhost:8000/some-api-namespace/some-route
 *
 */

module.exports = server;

/**
 * To hit another endpoint and pipe the response back out as though
 * it came from this server, use the following api passThrough (uses request and
 * node streams, see https://github.com/mikeal/request for more information)
 *
 * This is a quick and dirty way to bypass CORS header errors(when working w/
 * a remote service you don't own) or to make sure the FIXTURE data returned
 * by your routes above are not out of sync with your production server
 *
 * For a more robust solution to this problem install walmartlabs/mock-server
 * via the sub-generator command: yo thorax:mock-server
 *
 * Setting the API_SERVER env variable:
 *
 * A great way to get a new project up and running quickly is to spec out your
 * eventual production api server here in your dev express app. To make this easy
 * you may set the API_SERVER=stub as an env var when running grunt. When your
 * production server is ready, or to test that its not out of sync set API_SERVER=proxy
 * and the method below will be used wit h the 'proxyUrl' setting within package.json
 *
 */

var request = require('request');
function passThrough(target) {
  return function(req, res) {
    req.pipe(request(target+req.url)).pipe(res);
  };
}