/*jslint node: true*/
'use strict';

var io = require('socket.io-client');
var Emitter = require('events');
var parse = require('./configuration/parse');
var runner = require('./framework/runner');
var assign = require('object-assign-deep');
var panic;

function subscribe(socket) {

	socket.on('test', function (TDO) {
		parse(TDO);
		var listeners = panic.listenerCount('test');

		// Remove me!!
		runner(TDO);

		// no async middleware
		if (!listeners) {
			return socket.emit('ready', {
				clientID: panic.clientID,
				testID: TDO.ID
			});
		}

		panic.emit('test', TDO);
	});

	socket.on('run', function (TDO) {
		panic.emit('run', TDO);
	});
}

function connect(url) {
	var socket = io.connect(url);
	panic.connection = socket;

	subscribe(socket);

	return socket;
}

panic = module.exports = new Emitter();
assign(module.exports, {
	server: connect,
	connection: null,
	clientID: String.random(10)
});

if (typeof window !== 'undefined') {
	window.panic = panic;
}
