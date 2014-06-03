#georg
=========

georg (named after Georg Friedrich Bernhard Riemann) is a nodejs library that acts as an in-process riemann agent.
The library can send nodejs specific and application specific metrics to riemann.
Riemann (riemann.io) is a monitoring event hub, that can process event streams and forward to various data stores and visualization products.



## Unhandled Exceptions ##

georg supports detection of unhandled exceptions and sending them to riemann.

```javascript
var georg = require('georg');
georg.exceptions.catchExceptions({host: 'localhost', port: 5555});
```
## Latency Recording ##

georg supports recording service latencies and sending them to riemann. riemann receives the events and sends an alert in case the latencies cross a threshold.

```javascript
var georg = require('georg');
georg.latencies.startRecorder({host: 'localhost', port: 5555});
...
georg.latencies.recordLatency({name: "myService", type: "API", latencyMS : 400, completed: true});
```

### Additional Features ###
* georg auto-reconnects with riemann if a network failure occured.

###Release History

* 0.2.0 Upcoming release. Added latency recording feature, minor bug fixes.
* 0.1.3 Current release. Bug fixes, exception stack trace added, etc.
* 0.1.0 Initial release. Support unhandled exceptions and reconnect.