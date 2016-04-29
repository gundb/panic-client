Panic Client
------------
*Lightweight client for panic-server*

## Docs
Since this library is just support for [panic-server](https://github.com/gundb/panic-server), you can find the majority of the documentation [over there](https://github.com/gundb/panic-server/blob/master/README.md).

## Installing
Panic-client is hosted on [npm](https://www.npmjs.com/package/panic-client), and can be installed by running this in your terminal:

```bash
npm install panic-client
```

> If you're not familiar with npm, you can learn more by [clicking here](https://docs.npmjs.com/getting-started/what-is-npm), or you can install it by following [these instructions](http://blog.npmjs.org/post/85484771375/how-to-install-npm).

## Usage
Panic-client's API surface area is pretty small, since it's just a small wrapper around [socket.io](http://socket.io/). It consists of one method, `server`, and two properties, `connection` and `platform`.

There are two ways to include it in your code, depending on your environment...

**Node.js**
```javascript
// simply import it.
var panic = require('panic-client')
```

**Browser**

> If you're using [panic-server](https://github.com/gundb/panic-server), the server automatically delivers the browser file at the at the port/hostname you configured. By default, it will be 'http://localhost:8080/panic.js'.

If you're not using [panic-server](https://github.com/gundb/panic-server), it may be more complicated, depending on your file structure. If you're using [webpack](https://github.com/webpack/webpack), simply include it the same way as you would on Node.js. Otherwise, the browser build is located at root level, named `panic.js`. Simply point a script tag there, or copy it into your project root...

```html
<script src="node_modules/{path to panic-client}/panic.js"></script>
<script>
	panic; // now exposed as a global variable
</script>
```

Best practice is to load through panic-server.

```html
<script src="http://localhost:8080/panic.js"></script>
```

### `.server(String)`
This method attempts to connect to your panic-server host, and allows panic-server to run code on your machine in real-time. Just give it the url.

```javascript
// This is the default url.
// When connecting from another computer,
// exchange `localhost` with your ip address.
panic.server('http://localhost:8080')
```

### `.connection`
`panic.connection` is the websocket opened to panic-server. If you haven't called `panic.server()` yet, it'll be `null`.

### `.platform`
The `panic.platform` object is created by [platform.js](https://github.com/bestiejs/platform.js/), and contains information about what environment the code is running on.

## Support
If you have questions or ideas, please let us know on [our gitter channel](https://gitter.im/amark/gun) :grinning:
