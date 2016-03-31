/*globals jasmine, describe, it, expect*/
/*jslint node: true*/
'use strict';

var runner = require('../../src/framework/runner');
var Context = require('../../src/framework/Context');

function run() {
	// turn arguments into an array
	return runner({
		config: {
			cbs: ([]).slice.call(arguments)
		}
	});
}

describe('The client test runner', function () {
	it('should be a function', function () {
		expect(runner).toEqual(jasmine.any(Function));
	});

	it('should take a test descriptor and call the cbs', function (done) {
		run(function () {}, done);
	});

	it('should expose the "env" in the "this" context', function () {
		runner({
			config: {
				env: {
					success: true
				},
				cbs: [
					function () {
						expect(this.env.success).toBe(true);
					}
				]
			}
		});
	});

	it('should use a context instance as the "this" value', function () {
		run(function () {
			expect(this).toEqual(jasmine.any(Context));
		});
	});

	it('should send the context as the first cb param', function () {
		run(function (ctx) {
			expect(ctx).toEqual(jasmine.any(Context));
		});
	});

	it('should pass the "done" function in as the second param', function () {
		run(function (ctx, done) {
			expect(done).toEqual(jasmine.any(Function));
		});
	});

	it('should use the same context for all cbs', function () {
		var ctx;
		run(function () {
			ctx = this;
		}, function () {
			expect(this).toBe(ctx);
		});
	});

	it('should protect against null input', function () {
		expect(runner).not.toThrow();
	});
});
