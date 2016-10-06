/* eslint-env mocha*/
'use strict';
var runner = require('../src/runner');
var expect = require('expect');
var Promise = require('bluebird');

describe('A runner job', function () {

	this.timeout(500);

	it('should be invoked', function () {
		var spy = expect.createSpy();
		runner(spy);
		expect(spy).toHaveBeenCalled();
	});

	it('should expose `this.props`', function () {
		runner(function () {
			expect(this.props.value).toBe(10);
		}, {
			value: 10
		});
	});

	it('should default props to an empty object', function () {
		return runner(function () {
			expect(this.props).toBeAn(Object);
		});
	});

	it('should return a bluebird promise', function () {
		var result = runner(function () {});
		expect(result).toBeA(Promise);
	});

	it('should resolve if the job finishes', function (done) {
		var result = runner(function () {});
		result.then(done);
	});

	it('should reject if the job throws', function (done) {
		runner(function () {
			throw new Error('Runner rejection test.');
		}).catch(function () {
			done();
		});
	});

	it('should reject with an error report', function () {
		return runner(function () {
			throw new Error('Runner rejection report test.');
		}).catch(function (error) {
			expect(error).toBeAn(Object);
		});
	});

	it('should be async if returned a promise', function () {
		return runner(function () {
			return Promise.resolve('resolved');
		}).then(function (result) {
			expect(result).toBe('resolved');
		});
	});

	it('should pass the context as the first param', function () {
		return runner(function (ctx) {
			expect(ctx).toBe(this);
		});
	});

	it('should expose the platform', function () {
		return runner(function () {
			expect(this.platform).toBeAn(Object);
		});
	});

	it('should resolve to the return value', function () {
		return runner(function () {
			return 'primitive';
		}).then(function (result) {
			expect(result).toBe('primitive');
		});
	});

	describe('`.fail` call', function () {

		it('should reject the promise', function () {
			var msg = '.fail() rejection test.';
			return runner(function () {
				this.fail(msg);
			}).catch(function (error) {
				expect(error).toBe(msg);
			});
		});

	});

	describe('`.done` call', function () {

		it('should resolve the promise', function () {
			var msg = '.done() resolve test.';
			return runner(function () {
				this.done(msg);
			}).then(function (result) {
				expect(result).toBe(msg);
			});
		});

	});

	describe('`.async` call', function () {

		it('should return `.done`', function () {
			return runner(function () {
				var done = this.async();
				done('.async');
			}).then(function (result) {
				expect(result).toBe('.async');
			});
		});

		it('should wait for done to be called', function (done) {
			var finished = false;
			runner(function () {
				var done = this.async();
				setTimeout(function () {
					done();
				}, 30, 'done');
			}).then(function () {
				finished = true;
				done();
			});

			// .then is called asynchronously.
			// Checking like this means the first
			// (if synchronous) would've already resolved.
			Promise.resolve().then(function () {
				expect(finished).toBe(false);
			});
		});

	});

	describe('`.set` call', function () {

		it('should return the value', function () {
			return runner(function () {
				var value = this.set('name', 42);
				expect(value).toBe(42);
			});
		});

		it('should expose the value to other jobs', function () {
			return Promise.all([
				runner(function () {
					this.set('value', 10);
				}),
				runner(function () {
					var value = this.get('value');
					expect(value).toBe(10);
				})
			]);
		});

	});

	describe('`.get` call', function () {

		it('should filter out proto props', function () {
			return runner(function () {
				var toString = this.get('toString');
				expect(toString).toNotExist();
			});
		});

	});

});
