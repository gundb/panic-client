/*jslint node: true*/
'use strict';

var io = require('socket.io-client');
var Emitter = require('events');
var parse = require('../configuration/parse');
var assign = require('object-assign-deep');
var platform = require('platform');
var panic, tests = {};

function connect(url) {
	var socket = io.connect(url);
	panic.connection = socket;

	socket.emit('details', panic.clientID, platform);

	socket.on('test', function (TDO) {
		parse(TDO);
		tests[TDO.ID] = TDO;
		panic.emit('test', TDO);
	});

	socket.on('run', function (ID) {
		panic.emit('run', ID);
	});

	return socket;
}

panic = module.exports = new Emitter();
assign(module.exports, {
	server: connect,
	connection: null,
	clientID: String.random(10),
	platform: platform
});

panic.on('ready', function (ID) {
	panic.connection.emit('ready', ID, platform);
});

require('./runner');
