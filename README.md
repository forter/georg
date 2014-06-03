#georg
=========

georg (named after Georg Friedrich Bernhard Riemann) is a nodejs library that acts as an in-process riemann agent.
The library can send nodejs specific and application specific metrics to riemann.
Riemann (riemann.io) is a monitoring event hub, that can process event streams and forward to various data stores and visualization products.




### Auto-reconnect ###
georg reconnects with riemann if a network failure occured.

## Unhandled Exceptions ##

georg supports detection of unhandled exceptions and sending them to riemann.

```javascript
var georg = require('georg');
georg.exceptions.catchExceptions({host: 'localhost', port: 5555});
```

## Latencies ##
georg supports tracking of service latencies.

```javascript
var georg = require('georg');
georg.latencies.latencyRecorder({host: 'localhost', port: 5555});

georg.latencies.recordLatency({serviceName: 'name', serviceLatencyMS: 1000}) 

###Release History

* 0.2.0 Additional Latencies support. 
* 0.1.0 Initial release. Support unhandled exceptions and reconnect.
