# hitd

## A devOps microservices toolkit in Node.js

hitd is a large spectrum microservices toolkit in Node.JS.
It is similar in some points to [Seneca](https://github.com/rjrodger/seneca) , [Micromono](https://github.com/lsm/micromono) or [Spinal](https://github.com/jitta/spinal), but offer much more.
You can think of it as [Impress](https://github.com/tshemsedinov/impress) for microservices.

Regarding the low level stuff, __communication is made by [ZeroMQ](http://zeromq.org) for communication, and we use a request-responses paradigm.__
More precisely, It is based on [Pigato](https://github.com/prdn/pigato), who does an amazing jobs handling all the low level stuff.


# How is that Different ?
Hitd means 'How Is That Different' because when presenting early version of the project to some fellow developers from all background, _How is that Different from X ?_ was the single question they had in mind. We will in this introduction mainly try to answer this question, and will focus on the 5 following points :

 - Vertically Oriented
 - Great Tooling
 - Nano Service compliant
 - Build for Scalability
 - Not so opinionated

## Vertically Oriented

The main goal of _hitd_ is to reduce the gap between specification and implementation.
If you look at the low level stuff, it is similar to others microservices solutions, focusing on the architecture and communication between nodes.
But truth is, _hitd_ adds more layers in order to be usable directly by product manager. The final goal, but we are still very far from it, would be to transform specification to code.
Following this dream, we are also currently working on a graph based interface for building microservices architecture.

Because we provide basic microservices, you can deploy some basic applications without developing any microservice. And while your organization will create more microservice, the need to develop news one will be reduced.

## Great Tooling

We add abstraction layers, but it doesn't mean we forget developers. We know that sometimes you have no better choice than to write code. Code re-usability and sexy graphical interface are not a golden bullet. We want you to be comfortable writing and running some code running on top of _hitd_.

One of the tools we love the most, is `hitd-reload`. It allows you to dynamically live reload microservices while the code is changing. Great for delivery, but awesome for developments, where you will gain a lot of time.

We also developed some tools, _ie_ hitd-launch to dynamically install and load a microservice on a node.
All of this is described below.


## Nanoservice Compliant

A big challenge when switching from a monolithic application to a distributed application is to define the size of the slices of application once cutted. We don't provide a full answer to that question, but you can relax, you won't have a huge performance overhead because of too many very small microservices, aka nanoservices.


## Build for Scalability

The same way we are confident about building nanoservices, we are confident about the fact that you can make scalable software with _hitd_. Programmatically, there is no difference between reaching a local or a remote service :  all you have to do is a change in configuration.

When a microservice become a contention point, you can instantiate another instance of it on the same router. Then the load will spread over the different instances.

For complex softwares, you can create complex architecture to change the location of processing.


## Not So Opinionated

Of course, when designing complex softwares you have to make some choices.
From start, we decided to focus on simplicity and scalability.
We also wanted customization to be easily defined by configuration and not having to change the code.
Moreover, because we think that each project is different, you should have the choice to architect components the way you want. Of course, one of the goal of the micro-service approach is to have more reusable bricks between projects. It is totally up to you whether you want to instantiate the microservices for all of your project, or if you prefer a global instantiation. And of course, you can choose it for each service.

_Hitd_ is designed for orchestration, but there is solution to do choreography, or doing flow based programming à la [noFlo](http://noflojs.org).

# Usage

_Hitd_ can be seen as an Application Server or a Microservice Toolkit,depending of the way you use it. The global vision would be to say that it is a Distributed microservice Based Application Server framework.

## Application server
Seeing _Hitd_ as an application server, mean that you will run a server, says the _hitd_ command, and that you will be able to launch application/microservices in it.
This is possible.
In ordet to launch a microservice on top on an application server, to solution :
 - use hitd-launcher, a microservice automatically instantiated in the application server and allowing to launch dynamically a microservice
 - use hitd-vantage, a terminal based tools allowing you to interact with the application server
 - use a YML file, describing the topology of microservices to run in this process.

## Micro Service Toolkit

_Hitd_ is based on pigato, and exposes the same concept.
For example, there is 3 main technical components : Client `hitd-client`, Router `hitd-router` and Handler `hitd-handler`

The client connects to the router to emits requests.

The clients represent the interface between your users and your application.

The handler registers rules to respond to requests from the clients.

These rules contains your business logic.

Both, the clients and the handlers register on the router, which is the communication mean between the two.
When a client emits a request, the router chooses the right handler and forward the request to it.
Once the handler processed the request, the response is sent back to the router, then to the client.

Request : Client -> Router -> Handler

Response : Client <- Router <- Handler

#### Composition
If a microservice needs another microservice, then the Handler can instantiate and act as a Client.

Request : Client -> Router <- ( Handler + Client ) -> Router -> Handler

Response : Client -> Router <- ( Handler + Client ) <- Router <- Handler

The two routers could be the same, or they could be different.


### Give me some Code

I know, if prefere code than long speech, you are right know very frustrated.
The wait is over, you'll find below code samples for coding components.

## Client

A Client is responsible for emitting requests.
It connects to a router through an endpoint that is specified at instantiation.

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

## Router

The router is both the most simple and most complicated components. It is currently an instance of _Pigato_ Broker. His goal is to transmit message between nodes, and deal with balancing.

It receives requests from clients, and forwards them to the appropriate handlers. Because it is a single point between clients and handlers, it deals with balancing the load of requests between redundant handlers.

You probably won't need to code the execution of a router, because one is automatically luanched when launching the hidt server, otherwise, you can launch one directly from commande line.

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

## Handler

A handler registers rules to respond to requests.

A rule is defined by a `path`, and a `worker` function to process and respond to the request.
The `worker` function expects three arguments, the path that triggered the request, the request, and a callback to respond to the request.
A `worker` function can also use a client to emit a query before responding.

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

## Launch existing microservice

In order to launch microservices, you can do that in different manners, automatically or manually.
### With YML

As already mentioned, you can think of `hitd` as an application server.
An application server not running any application is useless, so you need an easy way to start microservices. This can be done easily, but let's start with a sample.

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
-  Launch a Router named 'front' and listening on endpoint  'ipc:///tmp/httpfront'.
-  Launch two microservice handlers, 'hitd-log404' and 'hitd-static', with specific parameters.
-  Launch the hitd-front client, which is is the service translating http request to hitd Request.
- Globally, this means that this application will we a webserver, service files from folder '~/mywebsite' under http://127.0.0.1:3000/mywebsite and will answer with a 404 response if we try to reach another folder or use another HTTP Host Header.

Based on this sample, you can now create more complex application.
Because Bindings is an arrays, you can add as many `Router` as you want.
`nodes` and `clients` are also arrays, so you can add as many of them as you want.

Regarding configuration, when launching a node, the configuration provided will be the configuration given to the router more the specific configuration.
If we have severals routers, you can also add a Defaults configuration which will be given to all.
This is convenient for example for providing the same Pigato heartbeat parameters to all components.

Please keep in mind that currently all microservice will be launched in the same process.
If you want to launch a distributed application, you will need severals YMLs, and to launch the hitd server by yourself, or submit a PR. ;)


### Manually

If you launch an hitd-server without YML files, it won't launch applicative microservices.
Still, the hitd-launch microservice, will be launched, and you willbe able to use a cleitn sendind request to it so it launch a specific services.
`hitd-vantage`  provide an easy way to launch a service without coding the launcher. With this REPL too, you will be able to launch, start or debug a microservice. 


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


## Tooling

The strength of _hitd_ is the tooling surrounding its simple core, helping you develop, maintain and run your application from development stage to production.

### Exploitation

#### hitd-launcher

`hitd-launcher` manages the execution of other microservices.
It can start, restart and stop instances.

*TODO code example*

#### hitd-relaunch

`hitd-relaunch` can watch your sources, and live-reload each microservice when you update it.
It depends on launcher.

Might also be usefull for deploying apps in  prod.

*TODO code example*

#### hitd-vantage

<!---
You need to rename this, the name vantage is already taken :p
-->
`hitd-vantage` lets you control your application on the fly.
It allows to load and reload services, and to change the debug level.
<!---
TODO : add a list command, to list currently running services, and display their package.json if any.
-->

*TODO usage example*

#### hitd-debug

`hitd-debug` allows each parts of your application to log its activity.
*TODO code and usage example*

### Available Microservices

Every avaialble microservice can be launched the same way.
we instantion the microservice with the endpoint, configuration, and callback.

For example, launching the hidt-front will be :

```javascript
var front = require('hitd-front');
front('ipc:///tmp/foo' , { heartbeat : 3000 } , function(){

  })
```

Any prof ? check the bin/index.js file of any givent microservice. They all are exactly identical.

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
### Conventions
Every service we provide follow specific conventions.

### Strating convetions
If you develop your own microservices, if you want them to be compatible with existing stack, please follow this convention.

Your service should be instantiated with 3 parameters, the endpoint, a service configuration, and a callback.

#### endpoint

The endpoint is the address the Router listen on for messages from Clients.
Clients and Handlers connect to this address to communicate with the Router.

#### configuration

the configuration is a mix of pigato configuration and service specific configuration

#### callback

The callback is a classicla callback
If the the second argument contains a method start, it should be called in order to start a service.


###configuration

### COntent conventions
body
http code
code  < 100


#### hitd-front

`hitd-front` is an HTTP server with a `hitd-client` forwarding requests to a router.

GET requests are forwarded to `<httpHOST>/<path>?queryParam`.
Others request are forwarded to `<method>/<httpHOST>/<path>?queryParam`.
For example : `POST/127.0.0.1:3000/foo?bar=baz`

Unlike others examples below , hitd-front is a client service. It has no hitd handler. It's because it translate http request in hitd request.
It it the first component that we use to build a service avaialble through HTTP.


**show config**

#### hitd-repository

`hitd-repository` is a `handler` to serve static files, such as web resources, from a Redis base.
It can be used to store any value in a key-value ways, but as also feature helping in the hosting of a website.
With `hitd-front` and `hitd-repository`, you can build a highly scalable and configurable hosting solution.

**show config**

#### hitd-static

`hitd-static` is a `hitd-handler` to serve static files directly from the filesystem.
It can be usefull during development in order to serve static file , or in production, mainly if you already have a distributed file system or a NAS/SAN

**show config**
### hitd-fetch

`hitd-fetch` is a `hitd-handler` to send HTTP request to external HTTP servers.

It is a bit the exact contraty of hitd-front. Usefull whena  a service need a http resource.
Thanks to hitd_clientId params, we are able to save client based cookies in this service.

**show config**

### hitd-log404

`hitd-log404` is a `hitd-handler` that registers a default path to catch all requests that would not be responded to otherwise.
It logs the requests, and returns a 404 code to notify the unfulfillment of the request.

Having a global handler is very usefull if you want to be sure that your request won't timeout because of no available node for this query.

**show config**


<!---
### Samples

#### formwebsite

sample static website,
please deploy with deploy static

#### deploystatic

tools to push static content inside repository

#### mainly

#### mongo

#### local

We need to check whether it is the same as the bin of dynamic sample
-->
