/*globals jasmine, describe, it, expect*/
/*jslint node: true*/
'use strict';

// functions are stringified in panic-server
Function.prototype.toJSON = Function.prototype.toString;

describe('The Function.parse method', function () {
	it('should be a function', function () {
		expect(Function.parse).toEqual(jasmine.any(Function));
	});

	it('should parse stringified functions', function (done) {
		var string = JSON.parse(JSON.stringify(function (finished) {
			finished();
		}));
		Function.parse(string)(done);
	});

	it('should parse anonymous functions', function () {
		var func = JSON.parse(JSON.stringify(function () {}));
		Function.parse(func); // shouldn't throw
	});

	it('should parse named functions', function () {
		var func = JSON.parse(JSON.stringify(function test() {}));
		Function.parse(func); // shouldn't throw
	});

	it('should return the value if not a function', function () {
		expect(Function.parse('true')).toBe(true);
		expect(Function.parse(true)).toBe(true);
		expect(Function.parse('5')).toBe(5);
		expect(Function.parse(5)).toBe(5);
	});
});
