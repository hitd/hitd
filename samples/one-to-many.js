
var Handler = require('..').Handler;
var Client = require('..').Client;
var Router = require('..').Router;

var endpoint = 'ipc:///tmp/feeds'+Math.random();

var conf = { heartbeat:30};

Router(endpoint , conf , function(err, router){
		Client(endpoint , conf , function(err, client){


			var createHandler = function(endpoint , conf , response, cb){

			var rules = {};
			rules["foo"] = function(rull, req, cb){
			cb(null, 200 , response);
			};

			Handler(endpoint , conf , rules , cb);

			};

			createHandler(endpoint , conf , 'first' , function(err){

				createHandler(endpoint , conf , 'two' , function(err){

	setInterval(function(){ 
					client.request('foo', '',function(err, status , res) { 
						console.log(res);

						});
						}, 500);
					} );
				});
		});
});






