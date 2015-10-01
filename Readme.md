hitd
====

A devOps microservices toolkit in Node.js
-----------------------------------------

hitd is a large spectrum microservices toolkit in Node.JS. It is similar in some points to [Seneca](https://github.com/rjrodger/seneca) , [Micromono](https://github.com/lsm/micromono) or [Spinal](https://github.com/jitta/spinal), but offers much more. You can think of it as [Impress](https://github.com/tshemsedinov/impress) for microservices.

For communication between services **[ZeroMQ](http://zeromq.org) handles the job, and we use a request-responses paradigm.** More precisely the low level stuff is based on [Pigato](https://github.com/prdn/pigato), who does an amazing jobs at handling all of it.

Install
-------

`#> npm i -g hitd`

Tutorial
--------

### Start

```
./hitd

> hitd@0.0.1 start /home/maxired/hitd-gitrepository-1
> node bin/index.js

                                                             dddddddd
hhhhhhh              iiii          tttt                     d::::::d
h:::::h             i::::i      ttt:::t                     d::::::d
h:::::h              iiii       t:::::t                     d::::::d
h:::::h                          t:::::t                     d:::::d
h::::h hhhhh       iiiiiiittttttt:::::ttttttt        ddddddddd:::::d
h::::hh:::::hhh    i:::::it:::::::::::::::::t      dd::::::::::::::d
h::::::::::::::hh   i::::it:::::::::::::::::t     d::::::::::::::::d
h:::::::hhh::::::h  i::::itttttt:::::::tttttt    d:::::::ddddd:::::d
h::::::h   h::::::h i::::i      t:::::t          d::::::d    d:::::d
h:::::h     h:::::h i::::i      t:::::t          d:::::d     d:::::d
h:::::h     h:::::h i::::i      t:::::t          d:::::d     d:::::d
h:::::h     h:::::h i::::i      t:::::t    ttttttd:::::d     d:::::d
h:::::h     h:::::hi::::::i     t::::::tttt:::::td::::::ddddd::::::dd
h:::::h     h:::::hi::::::i     tt::::::::::::::t d:::::::::::::::::d
h:::::h     h:::::hi::::::i       tt:::::::::::tt  d:::::::::ddd::::d
hhhhhhh     hhhhhhhiiiiiiii         ttttttttttt     ddddddddd   ddddd

Listening on ipc:///tmp/hitd-25617

hitd~
```

As you can see, when you run `hitd`, a REPL is launched, and from this prompt you can get help and spawn services.

#### start a service

For example you can start the http-front handler

`start hitd-front`

Of course, you might want to change the configuration or endpoint before spawning a service. You can do that with the helper method getendpoint/setendpoint and getconf/setconf.

Using thi service, you have spawned a webserver running on port 3000 of your host. Yet, a `curl http:/127.0.0.1:3000` will return a timeout. We indeed launched a webserver, but no router or handler.

`start hitd-router`

`start hitd-log404`

Of course, you can also create your own microservice and launch it. -> see devlop your service

Going deeper
============

How Is That Different ?
-----------------------

Hitd means 'How Is That Different' because when presenting early version of the project to some fellow developers from all background, *How is that Different from X ?* was the single question they had in mind. We will in this introduction mainly try to answer this question, and will focus on the 5 following points :

-	Vertically Oriented
-	Great Tooling
-	Nano Service compliant
-	Build for Scalability
-	Not so opinionated

Vertically Oriented
-------------------

The main goal of *hitd* is to reduce the gap between specification and implementation. If you look at the low level stuff, it is similar to others microservices solutions, focusing on the architecture and communication between nodes. But truth is, *hitd* adds more layers in order to be usable directly by product manager.

The final goal (but we are still very far from it), would be to transform specification to code. Following this dream, we are also currently working on a graph based interface for building microservices architecture.

We provide some basic microservices, enough so you can deploy some basic applications without developing any new one. For any application with a non trivial business logic, you'll of course need to create at some point [your own microservices](#Creating-my-own-microservice). Yet while you, or your organization, will create more and more microservices, the need to develop new ones will be decreased as a good microservice provides more re-use than monolithical code.

Great Tooling
-------------

Albeit we add some abstraction layers, it doesn't mean that we forget developers. We know that you often have no better choice than to write code. Code re-usability and sexy graphical interface are no golden bullets. We want you to be comfortable writing and running some code running on top of *hitd*.

One of the tools we love the most, is `hitd-reload`. It **allows you to dynamically live-reload microservices while the code is changing**. Great for delivery, but awesome for developments, where you will gain a lot of time.

We also developed some tools, *ie* `hitd-launch` to dynamically install and load a microservice on a node.

All of this is described [below](#Tooling).

Nanoservice Compliant
---------------------

A big challenge when switching from a monolithic application to a distributed application is to define the size of the slices of application once cut. We don't provide a full answer to that question, yet, you can already relax, you won't have a huge performance overhead because of you'll have sliced your project in too many very small microservices, aka nanoservices.

Build for Scalability
---------------------

The same way we are confident about building nanoservices, we are confident about the fact that you can make scalable software with *hitd*. Programmatically, there is no difference between reaching a local or a remote service : all you have to do is a change in configuration.

When a microservice becomes a bottleneck, you can spawn another instance of it on the same router. Then the load will spread over the different instances.

For complex softwares, you can create complex architecture to change the location of processing.

Not So Opinionated
------------------

Of course, when designing complex softwares you have to make some choices. From start, we decided to focus on simplicity and scalability. We also wanted customization to be easily defined by configuration and not having to change the code.

Moreover, because each project is different, you should have the choice to architect components the way you want it.

Of course, one of the goals of the microservice approach is to have more reusable bricks between projects. It is totally up to you whether you want to instantiate the microservices for all of your project, or if you prefer a global instantiation. And of course, you can choose it for each and every service.

*Hitd* is designed for orchestration, but there is solution to do choreography, or doing flow based programming à la [noFlo](http://noflojs.org).

Usage
=====

*Hitd* can be seen as an Application Server or a Microservice Toolkit, depending on the way you use it. The global vision would be to say that it is a *Distributed microservice Based Application Server framework*.

Application server
------------------

Seeing *Hitd* as an application server, mean that you will run a server, says the *hitd* command, and that you will be able to launch application/microservices in it. This is possible. In order to spawn a microservice on top on an application server, 3 solutions :

-	use hitd-launcher, a microservice automatically instantiated in the application server and allowing to launch dynamically a microservice.
-	use hitd-vantage, a terminal based tool allowing you to interact with the application server.
-	use a YML file, describing the topology of microservices to run in this process.

Micro Service Toolkit
---------------------

*Hitd* is based on [pigato](http://prdn.github.io/pigato/), and exposes the same concepts.

For example, there are 3 main technical components :

-	Client `hitd-client` : clients connect to the router to emit requests.
-	Router `hitd-router` : represents the interface between your users and your application.
-	Handler `hitd-handler` : handlers register rules to respond to requests from the clients. These rules contains your business logic.

Both, the clients and the handlers register on the router, which is the they can communicate together. When a client emits a request, the router chooses the right handler and forwards the request to it. Once the handler processed the request, the response is sent back to the router, then to the client.

Request : Client -> Router -> Handler

Response : Client <- Router <- Handler

#### Composition

If a microservice needs another microservice, then the Handler can instantiate and act as a Client.

Request : Client -> Router <- ( Handler + Client ) -> Router -> Handler

Response : Client -> Router <- ( Handler + Client ) <- Router <- Handler

The two routers could be the same, or they could be different.

### Give me some Code

Client
------

A Client is responsible for emitting requests. It connects to a router through an endpoint that is specified at instantiation.

For each `request`, the client specifies the `path` to send the request to, and a callback to wait for the result.

```javascript
var Client = require('hitd').Client,
    endpoint = 'ipc:///tmp/my_test_endpoint',
    conf = { heartbeat:30 };

function onClientReady(err, client) {
  client.request('foo', function(err, res) {
    console.log(res);
  });
}

var client = Client(endpoint, conf, onClientReady);
```

Router
------

The router is both the most simple and most complicated components. It is currently an instance of [*Pigato* Broker](https://github.com/prdn/pigato#actors). Its goal is to transmit message between nodes, and deal with balancing.

It receives requests from clients, and forwards them to the appropriate handlers. Because it is a single point between clients and handlers, it deals with balancing the load of requests between redundant handlers.

You probably won't need to code the execution of a router, because one is automatically spawnED when launching the hitd server, otherwise, you can launch one directly from command line.

```javascript
var Router = require('hitd').Router,
    endpoint = 'ipc:///tmp/my_test_endpoint',
    conf = { heartbeat:30 };

function onRouterRead() {
  // Nothing to do.
  // The router waits for requests from clients.
}

var router = Router(endpoint, conf, onRouterReady);

```

Handler
-------

A handler registers rules to respond to requests.

A rule is defined by a `path`, and a `worker` function to process and respond to the request. The `worker` function expects three arguments, the path that triggered the request, the request, and a callback to respond to the request. A `worker` function can also use a client to emit a query before responding.

```javascript
var Handler = require('hitd').Handler,
    endpoint = 'ipc:///tmp/my_test_endpoint',
    conf = { heartbeat:30 },
    rules = {
      'foo' : function worker(rulePath, req, cb){
        cb(null, 'bar');
      }
    };

function onHandlerReady(err){
  // Nothing to do.
  // The handler waits for requests from the router.
}

var handler = Handler(endpoint, conf, rules, onHandlerReady);
```

Spawn an existing microservice
------------------------------

In order to spawn microservices, you can do that in different manners, automatically or manually.

### Manually

If you spawn an `hitd-server` without any YML configuration file, it won't spawn any applicative microservices. Still, the `hitd-launch` microservice will be launched, and you will be able to use a client to send requests to it in order to spawn any specific service.

`hitd-vantage` provides an easy way to spawn a service without coding the launcher itself. Moreover, using this REPL, you will be able to launch, start or debug a microservice.

### With YML

As already mentioned, you can think of `hitd` as an application server. An application server not running any application would be useless, so you need an easy way to start microservices. This can be done easily, but let's start with an example :

```YML
---
Bindings :

  - name :  front
    endpoint:  ipc:///tmp/httpfront
    nodes :
      - name : hitd-log404
        hitd-log404 :
          host : '127.0.0.1:3000'

      - name : hitd-static
        static_prefix : 'http/127.0.0.1:3000/mywebsite'
        static_cwd : '~/mywebsite'

    clients :
      - name : hitd-front
        port : 3000

```

Thanks to this YML, we will :

-	Launch a Router named 'front' and listening on endpoint 'ipc:///tmp/httpfront'.
-	Launch 2 microservice handlers, 'hitd-log404' and 'hitd-static', with specific parameters.
-	Launch the hitd-front client, which is is the service translating http request to hitd Request.
-	Globally, this means that this application will be a webserver, service files from folder '~/mywebsite' under http://127.0.0.1:3000/mywebsite and will answer with a `404` response if we try to reach another folder or use another HTTP Host Header.

Based on this sample, you can now create more complex application. Because `Bindings` is an array, you can add as many `Router` as you want.`nodes` and `clients` are also arrays, so you can add as many of them as you want.

Regarding configuration, when launching a node, the configuration provided will be the configuration given to the router for the specific configuration.

If you have several routers, you can also add a `Defaults` configuration which will be given to all of them. This is very convenient for example for providing the same [Pigato heartbeat parameters](https://github.com/prdn/pigato#features) to all components.

Please keep in mind that currently all microservice will be launched in the same process. If you want to launch a distributed application, you will need severals YMLs, and to launch the hitd server by yourself, or submit a [PR](https://github.com/hitd/hitd/pulls). ;)

<!---

## Configuration

Available configuration options.

heartbeat

autostart: automatically starts the Client (type=boolean, default=false)
onConnect: function to be called when the Client connects to the Broker
onDisconnnect: function to be called when the Client disconnects from the Broker


```JSON
{
    'heartbeat': '30'
}
```
-->

---

```javascript

var Handler = require('hitd').Handler,
    Client = require('hitd').Client,
    Router = require('hitd').Router,
    endpoint = 'ipc:///tmp/feeds'+Math.random();

// Your business here

var conf = {
      heartbeat : 30
    },
    rules = {
      'foo' : fooWorker
    };

function fooWorker(rulePath, req, cb){
  cb(null, 'bar');
}

function fooRequest(client) {
  client.request('foo', function(err, res) {
    console.log(res);
  });
}

// Instantiation of your architecture :

function onRouterReady() {
  var handler = Handler(endpoint, conf, rules, onHandlerReady);
}

function onHandlerReady(err){
  var client = Client(endpoint, conf, onClientReady);
}

function onClientReady(err, client) {
  fooRequest(client);
}

var router = Router(endpoint, conf, onRouterReady);

```

<!---

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
-->

Tooling
-------

The strength of *hitd* is the tooling surrounding its simple core, helping you develop, maintain and run your application from development stage to production.

### Exploitation

#### hitd-launcher

`hitd-launcher` manages the execution of other microservices. It can start, restart and stop instances.

*TODO code example*

#### hitd-relaunch

`hitd-relaunch` can watch your sources, and live-reload each microservice when you update it. It depends on launcher.

Might also be usefull for deploying apps in prod.

*TODO code example*

#### hitd-vantage

<!---
You need to rename this, the name vantage is already taken :p
-->

`hitd-vantage` lets you control your application on the fly. It allows you to load and reload services, and to change the debug level.<!--- TODO : add a list command, to list currently running services, and display their package.json if any. -->

*TODO usage example*

#### hitd-debug

`hitd-debug` allows each parts of your application to log its activity.*TODO code and usage example*

### Available Microservices

Every available microservice can be launched the same way. We spawn the microservice with the endpoint, configuration, and callback.

For example, launching the `hidt-front` will be :

```javascript
var front = require('hitd-front');
front('ipc:///tmp/foo' , { heartbeat : 3000 } , function(){

  })
```

Any proof ? Check the bin/index.js file of any given microservice. They all are exactly identical.

```javascript
var myModule = require('..');
var myPackage = require('../package.json');

var debug = require('hitd-debug')(myPackage.name);

debug('will start');

var registerEndPoint = 'tcp://127.0.0.1:12345';
if (process.env.ROUTER_ENV_INPORT_CLIENT_ADDR && process.env.ROUTER_ENV_INPORT_CLIENT_PROTO &&
  process.env.ROUTER_ENV_INPORT_CLIENT_PORT) {
  registerEndPoint = process.env.ROUTER_ENV_INPORT_CLIENT_PROTO + '://' +
    process.env.ROUTER_ENV_INPORT_CLIENT_ADDR + ':' + process.env.ROUTER_ENV_INPORT_CLIENT_PORT;
}

myModule(registerEndPoint, {
  heartbeat: 30
}, function() {
  debug('did start');
})
```

### Creating my own microservice

Every service we provide follows those specific conventions.

### Starting conventions

If you develop your own microservices, if you want them to be compatible with existing stack, please follow this convention.

Your service should be spawned with 3 parameters, the endpoint, a service configuration, and a callback.

#### endpoint

The endpoint is the address the Router listens to for messages from Clients. Clients and Handlers connect to this address to communicate with the Router.

#### configuration

The configuration is a mix of [Pigato configuration](https://github.com/prdn/pigato#api) and service specific configuration

#### callback

The callback is a classical, node style, callback. If the the second argument contains a method start, it should be called in order to start a service.

### Configuration

### Content conventions

body http code code < 100

#### hitd-front

`hitd-front` is an HTTP server with a `hitd-client` forwarding requests to a router.

GET requests are forwarded to `<httpHOST>/<path>?queryParam`. Others requests are forwarded to `<method>/<httpHOST>/<path>?queryParam`. For example : `POST/127.0.0.1:3000/foo?bar=baz`

Unlike others examples below , `hitd-front` is a client service. It has no hitd handler. It's because it translates http request in hitd request. It will be the first component that you will use to build a service available through HTTP.

**show config**

#### hitd-repository

`hitd-repository` is a `handler` to serve static files, such as web resources, from a Redis base. It can be used to store any value in a key-value ways, but it is also a feature helping for hosting of a website. Using both `hitd-front` and `hitd-repository`, you can build a highly scalable and configurable hosting solution.

**show config**

#### hitd-static

`hitd-static` is a `hitd-handler` to serve static files directly from the filesystem. It can be usefull during development in order to serve static file , or in production, mainly if you already have a distributed file system or a NAS/SAN

**show config**

### hitd-fetch

`hitd-fetch` is a `hitd-handler` to send HTTP request to external HTTP servers.

It is just the exact contrary of `hitd-front`. Useful when a service needs a http resource. Thanks to `hitd_clientId` parameters, we are able to save client based cookies in this service.

**show config**

### hitd-log404

`hitd-log404` is a `hitd-handler` that registers a default path to catch all requests that would not be responded to otherwise. It logs the requests, and returns a 404 code to notify the unfulfilment of the request.

Having a global handler is very useful if you want to be sure that your request won't timeout because of no available node for this query.

**show config**

<!---
### Samples

#### formwebsite

sample static website,
please deploy with deploy static

#### deploystatic

tools to push static content inside a repository

#### mainly

#### mongo

#### local

We need to check whether it is the same as the bin of dynamic sample
-->
