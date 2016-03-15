/*jslint node: true*/
'use strict';

var io = require('socket.io-client');
var Emitter = require('events');
var parse = require('./configuration/parse');
var runner = require('./framework/runner');
var panic;

function subscribe(socket) {

	var events = panic.events;
	socket.on('test', function (TDO) {
		TDO.cbs = parse(TDO.cbs);
		var listeners = events.listenerCount('test');

		// no async middleware
		if (!listeners) {
			return socket.emit('ready', panic.clientID);
		}

		events.on('run', function () {
			runner(TDO);
		});

		events.emit('test', TDO);
	});

	socket.on('run', function (TDO) {
		events.emit('run');
	});
}

function connect(url) {
	var socket = io.connect(url);
	panic.connection = socket;

	subscribe(socket);

	return socket;
}

module.exports = panic = {
	connect: connect,
	connection: null,
	events: new Emitter(),
	clientID: String.random()
};

if (typeof window !== 'undefined') {
	window.panic = panic;
}
