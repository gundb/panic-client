/*eslint "no-undef": "off"*/
/*globals describe, it*/
'use strict';

var parser = require('../src/parser');
var expect = require('chai').expect;

describe('The parser', function () {
	var cb = (function () {
		return 'success';
	}).toString();

	it('should return an evaluated string', function () {
		expect(parser('5')).to.eq(5);
	});

	it('should return a function when given a function string', function () {
		expect(parser(cb)()).to.eq('success');
	});

	it('should allow dynamic scope variables', function () {
		var mutable;
		parser(function () {
			mutable.called = true;
			expect(scopedVariable).to.eq('yep');
		}.toString(), {
			scopedVariable: 'yep',
			expect: expect,
			mutable: mutable = {
				called: false
			}
		})();
		expect(mutable.called).to.eq(true);
	});
});
