/*globals describe, it, beforeEach*/
/*eslint "no-new": "off"*/
'use strict';

var Job = require('../src/Job');
var Emitter = require('events');
var panic = require('../src');

describe('A job', function () {
	var key, cb;

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
});
