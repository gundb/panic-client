'use strict';

var io = require('socket.io-client');
var platform = require('platform');
var job = require('./job');
var panic;

/**
 * Handshakes with a panic server.
 * @param  {String} url - The root-relative URL to a panic server.
 * @return {Socket} - A new socket.io instance.
 */
function server(url) {
	var socket = panic.connection = io.connect(url);

	/** Do whatever the server says. */
	socket.on('run', function (source, id, props) {
		job(socket, {
			source: source,
			props: props,
			id: id
		});
	});

	/** Perform an initial handshake. */
	socket.emit('handshake', platform);

	return socket;
}

panic = module.exports = {
	server: server,

	/** A connection with a panic-server. */
	connection: null,

	/** The platform.js object. */
	platform: platform
};
