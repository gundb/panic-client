/*globals jasmine, describe, it, expect, beforeEach, spyOn*/
/*jslint node: true*/
'use strict';

var io = require('socket.io-client');
var Emitter = require('events');
var url = 'http://localhost:8080';

global.window = {};
var panic = require('../src');

describe('The panic interface', function () {
	it('should export an object', function () {
		expect(panic).toEqual(jasmine.any(Object));
	});

	it('should have a "connect" property', function () {
		expect(panic.connect).toEqual(jasmine.any(Function));
	});

	it('should export onto "window" if it exists', function () {
		expect(window.panic).toBe(panic);
	});

	it('should expose the socket interface', function () {
		expect(panic.hasOwnProperty('connection')).toBe(true);
	});

	it('should export the client ID', function () {
		expect(panic.clientID).toEqual(jasmine.any(String));
		expect(panic.clientID.length).toBeGreaterThan(5);
	});

	it('should default the socket to "null"', function () {
		expect(panic.connection).toBe(null);
	});

	it('should set the socket after calling "connect"', function () {
		var obj = { on: function () {} };
		spyOn(io, 'connect').and.returnValue(obj);
		panic.connect(url);
		expect(panic.connection).toBe(obj);
	});

	describe('"connect" property', function () {

		beforeEach(function () {
			spyOn(io, 'connect').and.callThrough();
		});

		it('should call io.connect()', function () {
			panic.connect(url);
			expect(io.connect).toHaveBeenCalled();
		});

		it('should pass arg0 to io.connect', function () {
			panic.connect(url);
			expect(io.connect).toHaveBeenCalledWith(url);
		});

		it('should return the socket', function () {
			var result = panic.connect(url);
			expect(result).toBe(panic.connection);
		});
	});

	it('should expose an Emitter instance', function () {
		expect(panic.events).toEqual(jasmine.any(Emitter));
	});

	it('should listen for test objects', function () {
		var length = panic.connect(url).listeners('test').length;
		expect(length).toBeGreaterThan(0);
	});

	it('should listen for run events', function () {
		var length = panic.connect(url).listeners('run').length;
		expect(length).toBeGreaterThan(0);
	});

	it('should emit "test" on when a TDO comes in', function (done) {
		var cb = panic.connect(url).listeners('test')[0];
		panic.events.on('test', done);
		cb({});
	});

	it('should emit "run" on run command', function (done) {
		var cb = panic.connect(url).listeners('run')[0];
		panic.events.on('run', done);
		cb({});
	});

	it('should pass the TDO to the callbacks', function () {
		var TDO, cb;
		cb = panic.connect(url).listeners('test')[0];
		panic.events.on('test', function test(param) {
			expect(param).toBe(TDO);
			panic.events.removeListener('test', test);
		});
		cb(TDO = {});
	});

	it('should parse the TDO on "test" event', function () {
		var cb = panic.connect(url).listeners('test')[0];
		panic.events.on('test', function test(TDO) {
			expect(TDO.cbs[0]).toEqual(jasmine.any(Function));
			panic.events.removeListener('test', test);
		});
		cb({
			cbs: [{ cb: function () {} }]
		});
	});
});
