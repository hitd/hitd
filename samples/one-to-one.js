
var Handler = require('..').Handler;
var Client = require('..').Client;
var Router = require('..').Router;

var endpoint = 'ipc:///tmp/feeds'+Math.random();

var conf = { heartbeat:30};

Router(endpoint , conf , function(err, router){
		Client(endpoint , conf , function(err, client){



			var rules = {};
			rules["foo"] = function(rull, req, cb){
			cb(null, 200 , 'bar');
			};


			Handler(endpoint , conf , rules , function(err ){

				client.request('foo', '',function(err, status , res) { 
					console.log(res);
					} );
				});
			});
});






