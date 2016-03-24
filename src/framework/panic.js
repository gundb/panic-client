/*jslint node: true*/
'use strict';

var io = require('socket.io-client');
var Emitter = require('events');
var parse = require('../configuration/parse');
var assign = require('object-assign-deep');
var panic, tests = {};

function subscribe(socket) {

	socket.on('test', function (TDO) {
		parse(TDO);
		tests[TDO.ID] = TDO;
		panic.emit('test', TDO);
	});

	socket.on('run', function (ID) {
		panic.emit('run', ID);
	});
}

function connect(url) {
	var socket = io.connect(url);
	panic.connection = socket;

	socket.emit('ID', panic.clientID);

	subscribe(socket);

	return socket;
}

panic = module.exports = new Emitter();
assign(module.exports, {
	server: connect,
	connection: null,
	clientID: String.random(10)
});

require('./runner');
