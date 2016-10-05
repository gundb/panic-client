/*globals describe, it, beforeEach*/
/*eslint-disable no-new */
'use strict';

var Job = require('../src/Job');
var Emitter = require('events');
var panic = require('../src');
var expect = require('chai').expect;

describe('A job', function () {
	var key, cb, job;

	beforeEach(function () {
		panic.connection = new Emitter();
		key = Math.random()
		.toString(36)
		.slice(2);
		cb = (function () {}).toString();
	});

	beforeEach(function () {
		panic.connection.on(key, function (report) {
			expect(report.error).not.to.be.an.instanceof(Error);
		});
	});

	it('should eval and call function strings', function (done) {
		var finished = done.bind(null, null);
		panic.connection.on(key, finished);
		new Job(cb, key);
	});

	it('should make the scope data accessible', function () {
		job = new Job(cb, key, {
			success: true
		});
		expect(job.data.success).to.eq(true);
	});

	it('should not export local variables by default', function () {
		new Job(function () {
			if (typeof scope !== 'undefined') {
				throw new Error('Scope should not be defined');
			}
		}.toString(), key, {
			scope: '"scope"'
		});
	});

	it('should allow you to export vars', function () {
		new Job(function () {
			if (typeof scope === 'undefined') {
				throw new Error('The scope variable should be defined');
			}
		}.toString(), key, {
			scope: '"scope"',
			'@scope': true
		});
	});

	it('should export the platform', function () {
		var matches = {};
		new Job(function () {
			this.data.matches.platform = this.platform;
		}.toString(), key, {
			matches: matches
		});
		expect(matches.platform).to.be.an.instanceof(Object);
	});

	it('should allow async execution', function (done) {
		var obj = {};
		new Job(function (done) {
			setTimeout(function () {
				obj.async = true;
				done();
			}, 10);
		}.toString(), key, {
			obj: obj,
			'@scope': true
		});
		expect(obj.async).to.eq(undefined);
		setTimeout(function () {
			expect(obj.async).to.eq(true);
			done();
		}, 20);
	});

	describe('state setter', function () {
		it('should allow other jobs to use the value', function () {
			new Job(function () {
				this.set('value', 5);
			}.toString(), key);

			new Job(function () {
				var value = this.get('value');
				if (value !== 5) {
					throw new Error('Expected value to be 5');
				}
			}.toString(), key);
		});

		it('should return the value it just set', function () {
			new Job(function () {
				var value = this.set('data', 'value');
				if (value !== 'value') {
					throw new Error('Expected value to be "value"');
				}
			}.toString(), key);
		});
	});

	describe('state getter', function () {
		it('should ignore prototype properties', function () {
			new Job(function () {
				var value = this.get('toString');
				if (value !== undefined) {
					throw new Error('Expected value to be undefined');
				}
			}.toString(), key);
		});
	});
});
