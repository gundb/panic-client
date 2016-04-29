'use strict';

var io = require('socket.io-client');
var platform = require('platform');
var Job, panic;

function server(url) {
	var socket = panic.connection = io.connect(url);
	Job.prototype.socket = socket;

	socket.on('run', Job).emit('handshake', platform);

	return socket;
}

panic = module.exports = {
	server: server,
	connection: null,
	platform: platform
};

Job = require('./Job');
