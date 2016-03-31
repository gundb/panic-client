/*globals jasmine, describe, it, expect*/
/*jslint node: true*/
'use strict';

var Context = require('../../src/framework/Context');

describe('The client context constructor', function () {
	var context;

	beforeEach(function () {
		context = new Context({
			config: {
				env: {}
			}
		});
	});

	it('should always create an "env" property', function () {
		expect(context.env).toEqual(jasmine.any(Object));
	});

	it('should merge the "env" property with arg0', function () {
		var context = new Context({
			config: {
				env: { success: true }
			}
		});
		expect(context.env.success).toBe(true);
	});

	it('should have a "done" method', function () {
		expect(Context.prototype.done).toEqual(jasmine.any(Function));
	});

	it('should have a "fail" method', function () {
		expect(Context.prototype.fail).toEqual(jasmine.any(Function));
	});

});
