/*globals jasmine, describe, it, expect, beforeEach, spyOn*/
/*jslint node: true*/
'use strict';

var io = require('socket.io-client');

global.window = {};
var panic = require('../src');

describe('The entry file', function () {
	it('should export an object', function () {
		expect(panic).toEqual(jasmine.any(Object));
	});

	it('should have a "connect" property', function () {
		expect(panic.connect).toEqual(jasmine.any(Function));
	});

	it('should export onto "window" if it exists', function () {
		expect(window.panic).toBe(panic);
	});

	describe('"connect" property', function () {

		beforeEach(function () {
			spyOn(io, 'connect');
		});

		it('should call io.connect()', function () {
			panic.connect();
			expect(io.connect).toHaveBeenCalled();
		});

		it('should pass arg0 to io.connect', function () {
			var url = 'http://localhost:8080';
			panic.connect(url);
			expect(io.connect).toHaveBeenCalledWith(url);
		});
	});
});
