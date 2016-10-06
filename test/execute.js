/* eslint-env mocha*/
'use strict';

var execute = require('../src/execute');
var Emitter = require('events');
var expect = require('expect');

describe('A job', function () {
	var job, socket, spy;

	beforeEach(function () {
		var rand = Math.random();
		socket = new Emitter();

		spy = expect.createSpy();

		job = {
			id: rand.toString(36).slice(2),
			source: String(function () {}),
			props: {}
		};
	});

	it('should forward the props object', function () {
		job.source = String(function () {
			if (!this.props.value) {
				throw new Error('Props not sent.');
			}
		});
		job.props = {
			value: 10
		};

		socket.on(job.id, spy);

		return execute(socket, job).then(function () {
			var report = spy.calls[0].arguments[0];
			expect(report.error).toNotExist();
		});
	});

	it('should emit on the job ID when finished', function () {
		socket.on(job.id, spy);

		return execute(socket, job).then(function () {
			expect(spy).toHaveBeenCalled();
		});
	});

	it('should report errors if failed', function () {
		job.source = String(function () {
			throw new Error('`execute` error reporting test.');
		});

		socket.on(job.id, spy);

		return execute(socket, job).then(function () {
			var report = spy.calls[0].arguments[0];
			expect(report).toBeAn(Object);
		});
	});

	it('should attach debugging info to errors', function () {
		job.source = String(function () {
			throw new Error('Testing debugging extensions.');
		});

		socket.on(job.id, spy);

		return execute(socket, job).then(function () {
			var report = spy.calls[0].arguments[0];
			var error = report.error;
			expect(error.platform).toBeAn(Object);
			expect(error.source).toBe(job.source);
		});
	});

	it('should report return values', function () {
		job.source = String(function () {
			return 'success!';
		});

		socket.on(job.id, spy);

		return execute(socket, job).then(function () {
			var report = spy.calls[0].arguments[0];
			expect(report.value).toBe('success!');
		});
	});

	it('should use the type for invalid json values', function () {
		job.source = String(function () {
			var obj = {};
			obj.obj = obj;

			// Self-referential.
			return obj;
		});

		socket.on(job.id, spy);

		return execute(socket, job).then(function () {
			var report = spy.calls[0].arguments[0];
			expect(report.value).toBe('[object Object]');
		});
	});

});
