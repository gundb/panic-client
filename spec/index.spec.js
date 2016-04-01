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

	it('should have a "server" property', function () {
		expect(panic.server).toEqual(jasmine.any(Function));
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

	it('should set the socket after calling "server"', function () {
		var obj = { on: function () {}, emit: function () {} };
		spyOn(io, 'connect').and.returnValue(obj);
		panic.server(url);
		expect(panic.connection).toBe(obj);
	});

	describe('"connect" property', function () {

		beforeEach(function () {
			spyOn(io, 'connect').and.callThrough();
		});

		it('should call io.connect()', function () {
			panic.server(url);
			expect(io.connect).toHaveBeenCalled();
		});

		it('should return the socket', function () {
			var result = panic.server(url);
			expect(result).toBe(panic.connection);
		});
	});

	it('should expose an Emitter instance', function () {
		expect(panic).toEqual(jasmine.any(Emitter));
	});

	it('should listen for test objects', function () {
		var length = panic.server(url).listeners('test').length;
		expect(length).toBeGreaterThan(0);
	});

	it('should listen for run events', function () {
		var length = panic.server(url).listeners('run').length;
		expect(length).toBeGreaterThan(0);
	});
});
