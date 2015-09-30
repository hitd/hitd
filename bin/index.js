#!/usr/bin/env node

var logoLines = [
  '                                                             dddddddd',
  'hhhhhhh              \033[31miiii\033[0m          tttt                     d::::::d',
  'h:::::h             \033[31mi\033[36m::::\033[31mi\033[0m      ttt:::t                     d::::::d',
  'h:::::h              \033[31miiii \033[0m      t:::::t                     d::::::d',
  'h:::::h                          t:::::t                     d:::::d',
  'h::::h hhhhh       iiiiiiittttttt:::::ttttttt        ddddddddd:::::d',
  'h::::hh:::::hhh    i:::::it:::::::::::::::::t      dd::::::::::::::d',
  'h::::::::::::::hh   i::::it:::::::::::::::::t     d::::::::::::::::d',
  'h:::::::hhh::::::h  i::::itttttt:::::::tttttt    d:::::::ddddd:::::d',
  'h::::::h   h::::::h i::::i      t:::::t          d::::::d    d:::::d',
  'h:::::h     h:::::h i::::i      t:::::t          d:::::d     d:::::d',
  'h:::::h     h:::::h i::::i      t:::::t          d:::::d     d:::::d',
  'h:::::h     h:::::h i::::i      t:::::t    ttttttd:::::d     d:::::d',
  'h:::::h     h:::::hi::::::i     t::::::tttt:::::td::::::ddddd::::::dd',
  'h:::::h     h:::::hi::::::i     tt::::::::::::::t d:::::::::::::::::d',
  'h:::::h     h:::::hi::::::i       tt:::::::::::tt  d:::::::::ddd::::d',
  'hhhhhhh     hhhhhhhiiiiiiii         ttttttttttt     ddddddddd   ddddd',
  ''
];

logoLines.forEach(function(line) {
  console.log(line);
});

var program = require('commander');

program
  .version('0.0.1')
  .option('-n, --noconfig', 'don\'t look for config file')
  .option('-c, --config [file]', 'config file for your application')
  .option('-e, --endpoint [endpoint]', 'Internal ednpoint for this daemonn',
    'ipc:///tmp/hitd-' + process.pid
  )
  .option('-d, --debug [debug]', 'Debug flag for your application []',
    '')
  .option('-v, --verbose',
    'config file for your application = \'-d zone522\'')
  .option('-w, --watch',
    'watch file and automatically reload microservices if their file changed'
  )
  .option('-D, --daemon',
    'don\'t show the REPl')
  .parse(process.argv);


var fs = require('fs');
var async = require('async'),
  _ = require('underscore');

var Debug = require('hitd-debug');

Debug.enable((program.verbose ? 'hitd,' : '') + program.debug);
var debug = Debug('hitd');


var internalEndpoint = program.endpoint;
var internalConf = {
  heartbeat: 30
};

var internal = require('../lib/internal.js');


var launchConfigFileIfNeeded = function(program, cb) {
  if (program.noconfig) {
    return cb(null);
  }

  var configParser = require('../lib/config.js');

  configParser.openFile(program.config || 'hitd.yml', function(err, file) {
    if (err && err.code == 'ENOENT' && !program.config) {
      debug('default file not found don\t start anything')
      cb(null);
    } else if (err) {
      cb(err);
    } else {
      //file founded, let pars it

      configParser.parseYMLFile(file, function(err, startConf) {
        if (err) {
          cb(err);
        }
        launchStartConf(startConf, function(err) {
          cb(err);
        });
      });

    }
  });
};


var vantageIfNeeded = function(program, internalEndpoint, internalConf, cb) {

  if (program.daemon) {
    cb(null);
  }

  //vantage if needed
  var vantage = require('hitd-vantage');
  vantage(internalEndpoint, _.extend({
      delimiter: 'hitd~',
      'port': 8787
    }, internalConf),
    function(err, vantage) {
      if (err) {
        return cb(err);
      }
      vantage.show();
      cb(null);
    });
};



//launch internal
internal(internalEndpoint, internalConf, function(err, client) {
  debug('internal launched', err);
  console.log("Listening on", internalEndpoint, '\n');

  vantageIfNeeded(program, internalEndpoint, internalConf, function() {
    //console.log("vantage");

    launchConfigFileIfNeeded(program, function(err) {
      //console.log('done');

    });
  });
});



function launchStartConf(conf, cb) {
  async.each(conf.Bindings, function(binding, cb) {
    launchBinding(conf.Default, binding, cb);
  }, function() {
    console.log("Every Binding correctly stated");

  });
};
/*
if (program.watch) {
  client.request('hitd-launcher/launch', {
    name: 'hitd-relaunch',
    endpoint: internalEndpoint,
    conf: internalConf
  }, function() {
    debug('watching file for reload');
    cb(null);
  });
}
 */
/*
configParser.parse(program.config, function(err, conf) {
    console.log("parse file", err, conf);
    if (err) {
      debug('err while parsing', err);

      cb(null);
    }
    async.each(conf.Bindings, function(binding, cb) {
        launchBinding(conf.Default, binding, cb);
      }, function() {
        console.log("Every Binding correctly stated");

        if (program.watch) {
          client.request('hitd-launcher/launch', {
            name: 'hitd-relaunch',
            endpoint: internalEndpoint,
            conf: internalConf
          }, function() {
            debug('watching file for reload');
            cb(null);
          });
        };



      }

      internal(internalEndpoint, internalConf, function(err, client) {
        debug('internal launched', err);
        console.log("Listening on ", internalEndpoint);

        console.log("launch vantage");
        var vantage = require('hitd-vantage');


        vantage(internalEndpoint, _.extend({
            delimiter: 'hitd~',
            'port': 8787
          }, internalConf),
          function(err, vantage) {


            console.log("did vantage", err);
            program.daemon || vantage.show();
          });
      });
});*/

function launchBinding(defaultConf, binding, cb) {
  // we launch the router, then the nodes

  var bindingOnlyConf = _.clone(binding);
  delete bindingOnlyConf.nodes;

  var bindingConf = _.extend(_.clone(defaultConf), bindingOnlyConf);
  delete bindingConf.name;
  debug('will request launching binding');
  client.request('hitd-launcher/launch', {
    name: 'hitd-router',
    endpoint: binding.endpoint,
    conf: bindingConf
  }, function(err) {
    debug('router launched', err);
    async.each(binding.nodes || binding.workers, function(node,
        cb) {

        var conf = _.extend(bindingConf, node);
        delete conf.name;
        debug('will start node %s ', node.name);
        client.request('hitd-launcher/launch', {
            name: node.name,
            endpoint: binding.endpoint,
            conf: conf
          },
          function(err,
            body, code) {
            debug("did start node %s ", node.name);
            cb();
          });
      },
      function() {
        debug(
          'Everything Worker correctly started for binding %s',
          binding.name);
        async.eachSeries(binding.clients, function(clientConf,
          cb) {
          var conf = _.extend(bindingConf, clientConf);
          delete conf.name;

          client.request('hitd-launcher/launch', {
              name: clientConf.name,
              endpoint: binding.endpoint,
              conf: clientConf
            },
            function(err,
              code, body) {
              debug("did start client %s ", clientConf.name);
              cb();
            });
        }, function() {
          debug("Everything Client correctly stated");
          cb();
        });
      });
  });
}
