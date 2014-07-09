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
  
  execptions: {
    killTimeoutMS: 1000,
    //optional logger for integration with winston logging framework
    logger: function(err,done) { 
      logger.error("Unhandled exception: %s", err.stack, done);
  },
  
  latencies: {}
});
```

### Unhandled Exceptions ###
georg supports detection of unhandled exceptions and sending them to riemann.
The JSON contains a kill timeout and a logging function (which receives an exception and a callback. the function logs the exception and calls the callback).

### Latency Recording ###
georg supports recording service latencies and monitoring them via riemann.
The feature variable name is 'latencies'.
Record each latency using the startLatency and endLatency method:
```javascript
var x = georg.startLatency(serviceName);
longLatencyFunction();
georg.endLatency(x);
```

riemann.config includes an [example of triggering an alert](riemann.config#L17) based on statistics of latency events and latency threshold

#### Additional Features ####
* georg auto-reconnects with riemann if a network failure occurred.

#### Release History ####
* 0.2.7 Current Release. Added extended configuring possibilities to exception handling.
* 0.2.0 Added latency recording feature, minor bug fixes.
* 0.1.0 Support unhandled exceptions and reconnect.

