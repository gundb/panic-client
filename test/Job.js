/*globals describe, it, beforeEach*/
/*eslint "no-new": "off"*/
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

	it('should eval and call function strings', function (done) {
		panic.connection.on(key, done);
		new Job(cb, key);
	});

	it('should make the scope data accessible', function () {
		job = new Job(cb, key, {
			success: true
		});
		expect(job.data.success).to.eq(true);
	});

	it('should allow you to turn off local variables', function () {
		panic.connection.on(key, function (err) {
			expect(err).not.to.be.an.instanceof(Error);
		});
		new Job(function () {
			if (typeof scope !== 'undefined') {
				throw new Error('Scope should not be defined');
			}
		}, key, {
			scope: '"scope"',
			'export vars': false
		});
	});

	it('should export the platform', function () {
		var matches = {};
		new Job(function () {
			this.data.matches.platform = this.platform;
		}, key, {
			matches: matches
		});
		expect(matches.platform).to.be.an.instanceof(Object);
	});
});
