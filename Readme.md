#hitd
##A devOps microservices toolkit in Node.js

hitd is a microservices toolkit in Node.JS, similar in some points to [Seneca](https://github.com/rjrodger/seneca) and/or [Micromono](https://github.com/lsm/micromono) , [Spinal](https://github.com/jitta/spinal).

__The initial choices we made was using [ZeroMQ](http://zeromq.org) for communication, and using a request-responses paradigm.__
More precisely, It is based on [Pigato](https://github.com/prdn/pigato), who does an amazing jobs handling all the low level stuff.

<!---
##First, show me some code
```javascript

var hitd = require('hitd'),
    endpoint = 'ipc:///tmp/feeds'+Math.random(),
    conf = { heartbeat:30 };

hitd.Router(endpoint , conf , function onRouterReady(err, router){
  hitd.Client(endpoint , conf , function onClientReady(err, client){
    var rules = {
      "foo" : function(rull, req, cb){
        cb(null, 'bar');
      }
    };

    hitd.Handler(endpoint , conf , rules , function onHandlerReady(err ){
      client.request('foo',function(err, res) {
        console.log(res);
      });
    });
  });
});
```
-->


#How is that Different ?
Hitd means 'How Is That Different' because when presenting early version of the project to some fellow developers from all background, How is that Different from X ? was the single questions they had in mind. We will in this introduction mainly try to answer this questions.

 - Vertically Oriented
 - Great Tooling
 - Nano Service compliant
 - Build for Scalability
 - Not so opinionated


##Vertically Oriented

The main goal of _hitd_ is to reduce the gap between specification and implementation.
For the first step of the implementation, It looked a lot at others microservices solutions, focusing on the architecture and communication between nodes.
With time, we added layers in order to focus less on developers and more on product manager. The final goal, but we are still very far from it, would be to transform specification to code.
For example, We are currently working on a graph based interface for building  microservices architecture.

<!--- etn:
In my opinion, it is confusing to retrace the history to justify your approach.
The first sentence is good.
But I fail to see the verticallity you mention.
Is it from hardware to software, or from developers to project manager ?
-->

##Great Tooling
Because we add abstraction layers doesn't mean we forget developers. We know that you sometimes have no better choice than to write code. Code reusability and sexy graphical interface are not a golden bullet. We want you to be comfortable writing and running some code running on top of hitd.

<!--- etn:
If I understood correctly, you could say that hitd allows to modify the architecture at different layer.
-->

One of the tools we love the most, is `hitd-reload`. It allows you to dynamically live reload microservices while the code is changing. Awesome for delivery, but mainly for developments, where you will gain a lot of time.

We also developed some tools to dynamically install and load a microservice on a node.

<!--- etn:
We could maybe be more exhaustive here, and point to more in-depth description below.
-->

## Nanoservice Compliant

A big challenge when switching from a monolithic application to a distributed application is to defined the size of the slices of application once cutted. We don't provide a full answer to that question, but you can relax, you won't have a huge performance overhead because of too many very small microservices, aka nanoservices.

<!--- etn:
Isn't performance more attractive than just nanoservice compliance ?
nanoservice compliance is just a by-product of your focus on performance, right ?
-->

## Build for Scalability

The same way we are confident about building nanoservices, we are confident about the fact that you can make scalable software with _hitd_. Programmatically, there is no difference between reaching a local or a remote service :  all you have to do is a change in configuration.
Moreover, for complex softwares, you can safely design your dataflow to change the location of processing.

<!--- etn:
Here, for example, we could talk about the fact that you can instantiate multiple routers to scale horizontally.
Also, I don't got the dataflow reference to change the location of processing.
-->

## Not So Opinionated

Of course, when designing complex softwares you have to make some choices.
Our initial choice was made to focus on simplicity, scalability.
We also wanted customization to be easily defined by configuration and not having to change the code.

<!--- etn:
You explain your focus at the beginning : reduce the gap between specification and implementation.
I don't get
-->

_Hitd_ is designed for orchestration, but there is solution to do choreography, or doing flow based programming à la [noFlo](http://noflojs.org).

# Usage

<!---
You can use _hitd_ the same way as other node.js micro-service library.
_hitd_ is based on _Pigato_, and can be used in a very similar way.
-->
In order to build a first application, you will use the 3 main technical components : Client `hitd-client`, Router `hitd-router` and Handler `hitd-handler`

The client connects to the router to emits requests.
The clients represent the interface between your users and your application.
The handler registers rules to respond to requests from the clients.
These rules contains your business logic.

Both, the clients and the handlers register on the router, which is the communication mean between the two.
When a client emits a request, the router chooses the right handler and forward the request to it.
Once the handler processed the request, the response is sent back to the router, then to the client.

Request : Client → Router → Handler
Response : Client ← Router ← Handler

#### Composition
If a microservice needs another microservice, then the Handler can act as a Client.

Request : Client → Router → ( Handler + Client ) → Router → Handler
Response : Client ← Router ← ( Handler + Client ) ← Router ← Handler

The two routers could be the same, or they could be different.

## Client

A client is responsible for emitting requests.
It connects to a router through an endpoint that is specified at instantiation.

For each `request`, the client specifies the `path` to send the request to, and a callback to wait for the result.

<!---
`Hitd-client` is the part of _hitd_ responsible for emitting request, and waiting for reply.
-->

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


The router receives requests from clients, and forwards them to the appropriate handlers. Because it is a single point between clients and handlers, it deals with balancing the load of requests between redundant handlers.

The router is based on the _Pigato_ broker.

<!---
`Hitd-router` is both the most simple and most complicated components. It is currently an instance of _Pigato_ Broker. His goal is to transmit message between nodes, and deal with balancing.
-->

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
A `worker` function can use a client to emit a query before responding.

<!---
`Hitd-handler` allows to register a function when receiving a request for an associated path. The associated function can do some work, and respond to the request. Of course a function associated to an handler can instantiate a client to emit new queries. This is the way we build application based on several services.
-->

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




<!---
## Endpoint

The endpoint is the address the Router listen on for messages from Clients.
Clients and Handlers connect to this address to communicate with the Router.

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

#### hitd-front

`hitd-front` is an HTTP server with a `hitd-client` forwarding requests to a router.

GET requests are forwarded to `<httpHOST>/<path>?queryParam`.
Others request are forwarded to `<method>/<httpHOST>/<path>?queryParam`.
For example : `POST/127.0.0.1:3000/foo?bar=baz`

*TODO code example*

#### hitd-repository

`hitd-repository` is a `hitd-handler` to serve static files, such as web resources, from a Redis base.
With `hitd-front` and `hitd-repository`, you can build a highly scalable and configurable hosting solution.

*TODO code example*

#### hitd-static

`hitd-static` is a `hitd-handler` to serve static files directly from the filesystem.

*TODO code example*

### hitd-fetch

`hitd-fetch` is a `hitd-handler` to send HTTP request to external HTTP servers.

*TODO code example*

### hitd-log404

`hitd-log404` is a `hitd-handler` that registers a default path to catch all requests that would not be responded to otherwise.
It logs the requests, and returns a 404 code to notify the unfulfillment of the request.

*TODO code example*


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
