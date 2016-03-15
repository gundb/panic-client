/*jslint node: true*/
'use strict';

var io = require('socket.io-client');
var Emitter = require('events');
var parse = require('./configuration/parse');
var panic;

function subscribe(socket) {

	var events = panic.events;
	socket.on('test', function (TDO) {
		TDO.cbs = parse(TDO.cbs);
		events.emit('test', TDO);
	});

	socket.on('run', function () {
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
	events: new Emitter()
};

if (typeof window !== 'undefined') {
	window.panic = panic;
}
