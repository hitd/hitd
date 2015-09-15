#hitd
##A devOps microservices toolkit in Node.js

hitd is a microservices toolkit in Node.JS, similar in some points to [Seneca](https://github.com/rjrodger/seneca) and/or [Micromono](https://github.com/lsm/micromono) , [Spinal](https://github.com/jitta/spinal).

__The initial choices we made was using [ZeroMQ](http://zeromq.org) for communication, and using a request-responses paradigme.__
More precisely, It is based on [Pigato](https://github.com/prdn/pigato), who does an amazing jobs handling all the low level stuff.

#How is that Different ?
Hitd means 'How Is That Different' because when presenting early version of the project to some fellow devellopers from all background, How is that Different from X ? was the single questions they had in mind. We will in this introduction mainly try to answer this questions.

 - Vertically Oriented
 - Great Tooling
 - Nano Service compliant
 - Build for Scalability
 - Not so opinionated


 ##Vertically Oriented

 The main goal of _hitd_ is to reduce the gap between specification and and implementation.
 For the first step if the implemntaiton, It looked a lot at others microservices solutions, focusing on the architecure and communication between nodes.
 With time, we added layers in order to focus less on developpers and more on product manager.he final goal, but we are still very far from it, would be to transform specification to code.
 For example, We are currently working on a graph based interface for building  microservices architecure.

 ##Great Tooling
 Because we add abstraction layers does'nt mean we forget developpers. We know that you sometimes have no better choice than to write code. Code reusability and sexy graphical interface are not a golden bullet. We want you to be confortable writing and running some code running on the of hitd.

 One of the tools we love the most, is hitd-reload. It allows you to dynamicaly live reload microservices while the code is changing. Awesome for delivery, but mainly for developements, where you will gain a lot of time.

 We also developed so tools to dynamicaly install and load a microservices on a node.


 ## Nano Service Compliant

 A big challenge when switching from a monolyth application to a distributed application is defined the size of the slices of application once cutted. We don't provide a full answer to that question, but you can relax, you won't have a huge performance overhead because of too many very small micro-service, aka nanoservices.


 ## Build for Scalability

 The same way we are confident about building nanoservices, we are confident about the fact that you can make scalable software with _hitd_. Programmatically, there is no difference between reaching a local or a remote service :  all you have to do is a change in configuration.
 Moreover, for complexe sofware, you can safely design your dataflow to change the location of processing.

 ## Not So opinionated

 Of course, when designing complex sofware you have to make some choices.
 Our initial choice was made to focus on simplicity, scalability.
 We also wanted customization to be easily defined by configuration and not having to change the code.


 _Hitd_ is designed for orchestration, but there is solution to do choreography, or doing flow bade programming à la [noFlo](http://noflojs.org).

 # Usage

 You can use _hitd_ the same way as others node.js micro-service library. In fact, as already mentioned, hitd is based on Pigato, and can be used in a very similar way.
 In order to build a first application, you need too use the 3 main technical components :
  - hitd-router :
  - hitd-client :
  - hitd-handler :

 Hitd-router is both the simple and most complicated components. It is currently an instance off pigato Broker. His goal is to transmit message between nodes, and deals with balancing.

 Hitd-client is the part of hitd responisble for emiting request, and wainting for reply

 Hitd-handler allow to register a function when receiving a request for an associated path. The associated function can do some work, dans reponde to the request. Of course a function associated to and handler car instance a client to emit new queries. This is the way we build application based on several services.


```javascript

var Handler = require('..').Handler;
var Client = require('..').Client;
var Router = require('..').Router;

var endpoint = 'ipc:///tmp/feeds'+Math.random();

var conf = { heartbeat:30 };

Router(endpoint , conf , function(err, router){
                Client(endpoint , conf , function(err, client){

                        var rules = {
                        "foo" :
                        function(rull, req, cb){
                        cb(null, 'bar');
                        }
                        };


                        Handler(endpoint , conf , rules , function(err ){

                                client.request('foo',function(err, res) {
                                        console.log(res);
                                        } );
                                });
                        });
                });


```





 ## : Hits bundle some tools, usable from developement stage to production.
 ## : Hits bundle some tools, usable from developement stage to production.## : Hits bundle some tools, usable from developement stage to production.## : Hits bundle some tools, usable from developement stage to production.## : Hits bundle some tools, usable from developement stage to production.
