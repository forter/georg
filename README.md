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
georg must be initialized once in the code, and it receives a list of strings, each representing a feature to be activated,
and a configuration object for the riemann connection.

```javascript
var georg = require('georg');
georg.init(['exceptions', 'latencies'], {host: '127.0.0.1', port: 5555});
```

### Unhandled Exceptions ###
georg supports detection of unhandled exceptions and sending them to riemann.
The feature string is 'exceptions'.

### Latency Recording ###
georg supports recording service latencies and monitoring them via riemann.
The feature string is 'latencies'.
Record each latency using the recordLatency method:
```javascript
georg.recordLatency({name: 'serviceName', latencyMS: 1000, error: err});
```

#### Additional Features ####
* georg auto-reconnects with riemann if a network failure occurred.

#### Release History ####

* 0.2.0 Current release. Added latency recording feature, changed initialization method.
* 0.1.0 Initial release. Support unhandled exceptions and reconnect.