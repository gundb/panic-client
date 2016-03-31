/*global jasmine, describe, it, expect*/
/*jslint node: true*/
'use strict';

var parse = require('../../src/configuration/parse');


describe('The client callback parser', function () {
	var TDO;

	beforeEach(function () {
		TDO = {
			ID: 'Test ID',
			description: 'Just a fake test',
			config: {
				env: {},
				cbs: []
			}
		};
	});

	function condition(val) {
		TDO.config.cbs.push({
			conditional: val,
			cb: 'function () {}'
		});
	}

	it('should return the TDO', function () {
		var output = parse(TDO);
		expect(output).toBe(TDO);
	});

	it('should return an array of callbacks', function () {
		condition(true);
		var output = parse(TDO).config.cbs;
		expect(output[0]).toEqual(jasmine.any(Function));
	});

	it('should filter against the conditional method', function () {
		condition(false);
		var output = parse(TDO).config.cbs;
		expect(output.length).toBe(0);
	});

	it('should accept expressions as conditionals', function () {
		condition(false);
		condition('false');
		condition('typeof true === "boolean"');
		var output = parse(TDO).config.cbs;
		expect(output.length).toBe(1);
	});

	it('should only return a list of functions', function () {
		condition(true);
		condition(false);
		condition('function () { return true }');
		condition(1);
		var output = parse(TDO).config.cbs;
		expect(output.length).toBe(3);
		output.forEach(function (cb) {
			expect(cb).toEqual(jasmine.any(Function));
		});
	});

	it('should filter out bad input', function () {
		TDO.config.cbs.push({
			conditional: true,
			cb: 5
		});
		condition(true);
		var output = parse(TDO).config.cbs;
		expect(output.length).toBe(1);
	});
});
