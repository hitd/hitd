var debug = require('hitd-debug')('hitd'),
  localLauncher = require('hitd-launcher').local;


module.exports = function(internalEndpoint, internalConf, cb) {

  var Client = require('hitd-client');
  var client;
  localLauncher('hitd-router', internalEndpoint, internalConf, function(err) {
    if (err) {
      return cb(err);
    }

    debug('Internal Router launched', err);
    localLauncher('hitd-launcher', internalEndpoint, internalConf, function(err) {
      if (err) {
        return cb(err);
      }
      debug('Internal Launcher launched', err);

      client = Client(internalEndpoint, internalConf, function(err, client) {
        debug('Internal Client launched', err);
        cb(null, client);
      });
    });
  });

};
