'use strict';

var io = require('socket.io-client');
var platform = require('platform');
var Job, panic;

/**
 * Handshakes with a panic server.
 * @param  {String} url - The root-relative URL to a panic server.
 * @return {Socket} - A new socket.io instance.
 */
function server(url) {
	var socket = panic.connection = io.connect(url);
	Job.prototype.socket = socket;

	/** Do whatever the server says. */
	socket.on('run', Job);

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

Job = require('./Job');
