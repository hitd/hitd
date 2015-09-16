#hitd
##A devOps microservices toolkit in Node.js

hitd is a microservices toolkit in Node.JS, similar in some points to [Seneca](https://github.com/rjrodger/seneca) and/or [Micromono](https://github.com/lsm/micromono) , [Spinal](https://github.com/jitta/spinal).

__The initial choices we made was using [ZeroMQ](http://zeromq.org) for communication, and using a request-responses paradigm.__
More precisely, It is based on [Pigato](https://github.com/prdn/pigato), who does an amazing jobs handling all the low level stuff.


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

>!--- etn:
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

You can use _hitd_ the same way as others node.js micro-service library. In fact, as already mentioned, _hitd_ is based on _Pigato_, and can be used in a very similar way.
In order to build a first application, you need too use the 3 main technical components :
  * hitd-router :
  * hitd-client :
  * hitd-handler :

There is necessarily at least one instance of these three components in your application.
The client listens for and receives requests, which it forward to the router.
The router choose the right handler to process the request, and respond to the router.

Client -> Router -> Handler

#### Composition
If a microservice needs another microservice, then the handler can act as a client, and send a request to the router.

Client -> Router -> Handler / Client -> Router -> Handler

The two router could be the same, or they could be different.

## Router

`Hitd-router` is both the most simple and most complicated components. It is currently an instance of _Pigato_ Broker. His goal is to transmit message between nodes, and deal with balancing.

```javascript
var Router = require('hitd').Router;



```

## Client

`Hitd-client` is the part of _hitd_ responsible for emitting request, and waiting for reply.

## Handler

`Hitd-handler` allows to register a function when receiving a request for an associated path. The associated function can do some work, and respond to the request. Of course a function associated to an handler can instantiate a client to emit new queries. This is the way we build application based on several services.


## Endpoint

The endpoint is the address the router listen on for messages from Client and Handler.

<!---
The endpoint is an internal communication mean.
Shouldn't it be hided from the developer ?
Instead of giving all the three components the same address, let the router choose an endpoint, and then let the Client and Handler connect to this endpoint by asking directly the router class.
For example, in the callback after router creation, you have a `router` object, you could just ask it for the endpoint
-->

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


<!--- etn:
The first thing I look for, when landing on a github page, is a code snippet to grasp how I am going to be using the stuff.
Maybe we should put a small snippet in the very beginning.
-->


##Included tooling

Hits bundle some tools, usable from developement stage to production.

###Debug

####Debug

####Vantage ?

###Launchers

####Launcher

You can configure launcher to launch at once all the microservices composing your application.

*TODO code example*

###Relaunch

You can configure relaunch to watch your dev files, and live-reload each microservice when you update the corresponding file.

*TODO code example*

###Available Microservices

####Front ?

####Repository

####Static

###Others

####deploystatic