/*jslint node: true*/
'use strict';

var io = require('socket.io-client');
var assign = require('object-assign-deep');
var platform = require('platform');
var Job, panic;

function connect(url) {
	var socket = panic.connection = io.connect(url);

	// reset the connection
	socket.on('disconnect', function () {
		socket.close();
		panic.server(url);
	});

	socket.emit('handshake', platform);

	socket.on('data', function (name, obj) {
		var data = Job.prototype.data;
		data[name] = data[name] || {};
		assign(data[name], obj || {});
	});

	socket.on('run', Job);

	return socket;
}

panic = module.exports = {
	server: connect,
	connection: null,
	platform: platform
};

Job = require('./Job');
