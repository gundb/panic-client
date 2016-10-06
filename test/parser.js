/*eslint "no-undef": "off"*/
/*globals describe, it*/
'use strict';

var parser = require('../src/parser');
var expect = require('expect');

describe('The parser', function () {

	it('should parse values', function () {
		var value = parser('5');
		expect(value).toBe(5);
	});

	it('should parse expressions', function () {
		var value = parser('10 + 5');
		expect(value).toBe(15);
	});

	it('should parse function strings', function () {
		var str = String(function () {
			return 'success!';
		});

		var fn = parser(str);
		var result = fn();

		expect(result).toBe('success!');
	});

});
