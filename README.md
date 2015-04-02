#georg
=========

georg (named after Georg Friedrich Bernhard Riemann) is a nodejs library that acts as an in-process riemann agent.
The library can send nodejs specific and application specific metrics to riemann.
Riemann (riemann.io) is a monitoring event hub, that can process event streams and forward to various data stores and visualization products.


## Installation ##
```bash
npm install georg
```

## Initialization ##
georg must be initialized once in the code. The initialization method receives the address and port of the riemann server,
and a list of boolean variables, each representing a feature to be activated.

```javascript
var georg = require('georg');
georg.init({
  
  host: '127.0.0.1',
  port: 5555,
  
  service: "my-service-name",
  
  exceptions: {
    killTimeoutMS: 1000,
    //optional logger for integration with winston logging framework
    logger: function(err,done) { 
      logger.error("Unhandled exception: %s", err.stack, done);
    }
    //optional function to suppress exception-exit, exception-log and exception-sendToRiemann. You can use any of the functions.
    suppressor : function(ex) {
        return new georg.Suppressor().suppressLog().suppressExit().suppressRiemann();
    }
  },
  latencies: {}
});
```

### Unhandled Exceptions ###
georg supports detection of unhandled exceptions and sending them to riemann.
The JSON contains a kill timeout, a logging function (which receives an exception and a callback. the function logs the exception and calls the callback),
and a suppress function ( which receives an exception, and returns a

### Latency Recording ###
georg supports recording service latencies and monitoring them via riemann.
The feature variable name is 'latencies'.
Record each latency using the startLatency and endLatency method:
```javascript
var x = georg.startLatency(serviceName);
longLatencyFunction();
var latency = georg.endLatency(x);
```

riemann.config includes an [example of triggering an alert](riemann.config#L17) based on statistics of latency events and latency threshold

### Custom Events ###
georg supports sending custom events to riemann.
The feature variable name id 'events'
Send an event using the sendEvent method:
```javascript
georg.init({service: "worker-manager-instance",
    host: "127.0.0.1",
    port: 5555});
georg.sendEvent({
    description: 'number of workers in the system'
    metric: 0
    tags: ['critical', 'availability']})
```

#### Additional Features ####
* georg auto-reconnects with riemann if a network failure occurred.

#### Release History ####
* 0.2.30 Return latency from endLatency method
* 0.2.16 Changed reporting of 'unexpected-exception' to 'exception'
* 0.2.15 Current Version. Added custom attributes sending.
* 0.2.0  Added latency recording feature, minor bug fixes.
* 0.1.0  Support unhandled exceptions and reconnect.

