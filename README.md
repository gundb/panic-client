Panic Client
------------

> This is meant to be used alongside [panic-server](https://github.com/gundb/panic-server).

## What it is
Panic is a distributed test framework built for [gunDB](https://github.com/amark/gun) to test end-to-end functionality, such as client/client interactions. Other E2E test frameworks focus more on a single browser. While valuable, collaborative apps are nearly impossible to test. For example:

```
browsers A and B connect to server C
browser A performs action and is done
server C sees action and is done
browser B sees action and is done

3 cases finished, no failures. Next test.
```

So while many test frameworks will focus on one of those peers, no test framework includes them all. This is a true end-to-end framework, and without it, real-time data sync has been a nightmare to test against.

## Usage

> **Warning:** panic is still under development.

Download [panic-server](https://github.com/PsychoLlama/panic-server.git), that's where the tests are written. To connect to the panic dispatcher, first include the panic src:

```bash
npm install PsychoLlama/panic-client
```

**Browser:**
```html
<script src="panic.js"></script>
<!-- this will expose the "panic" global -->

```
**Node.js:**
```javascript
var panic = require('panic-client');
```

Now all that's left is connecting to the panic server:

```javascript
// panic will default to this address
panic.server('http://localhost:8080')
```

The tests should begin automatically.


## Reference

- TDO - Test Description Object
  - Description
  - Id
  - Configuration object
    - an environment object
    - callbacks and conditionals

