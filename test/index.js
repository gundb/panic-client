/* eslint-env mocha*/
'use strict';

var io = require('socket.io-client');
var Emitter = require('events');
var expect = require('expect');

var socket = new Emitter();
var connect = expect.spyOn(io, 'connect').andReturn(socket);

// Faking for the test.
global.window = {};

var panic = require('../src/index');

describe('Panic client', function () {

	afterEach(function () {
		connect.reset();
		socket.removeAllListeners();
	});

	it('define panic as a browser global', function () {
		expect(global.window.panic).toBe(panic);
	});

	it('should export the platform', function () {
		expect(panic.platform).toBeAn(Object);
	});

	it('should default the socket to null', function () {
		expect(panic.socket).toBe(null);
	});

	it('should emit a handshake on connect', function () {
		var spy = expect.createSpy();
		socket.on('handshake', spy);

		panic.server('http://url.com');

		expect(spy).toHaveBeenCalledWith(panic.platform);
	});

	it('should set panic.socket to the socket', function () {
		panic.server('http://url.com');
		expect(panic.socket).toBe(socket);
	});

	it('should respond to "run" commands', function (done) {
		var str = String(function () {
			return 5;
		});

		panic.server('http://url.com');
		socket.on('job ID', function (report) {
			expect(report.value).toBe(5);
			done();
		});

		socket.emit('run', str, 'job ID', {
			props: true
		});
	});

});
