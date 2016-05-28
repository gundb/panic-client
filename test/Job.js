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

	it('should not export local variables by default', function () {
		panic.connection.on(key, function (err) {
			expect(err).not.to.be.an.instanceof(Error);
		});
		new Job(function () {
			if (typeof scope !== 'undefined') {
				throw new Error('Scope should not be defined');
			}
		}.toString(), key, {
			scope: '"scope"'
		});
	});

	it('should allow you to export vars', function () {
		panic.connection.on(key, function (err) {
			expect(err).not.to.be.an.instanceof(Error);
		});
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
		panic.connection.on(key, function (err) {
			expect(err).not.to.be.an.instanceof(Error);
		});
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
});
