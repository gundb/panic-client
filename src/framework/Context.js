/*jslint node: true, nomen: true*/
'use strict';

var assign = require('object-assign-deep');
var panic = require('./panic');

function Context(test) {
	this._ = {
		test: test
	};
	this.env = {};

	assign(this.env, test.config.env);

	this.done = this.done.bind(this);
	this.fail = this.fail.bind(this);
}

Context.prototype = {
	constructor: Context,

	// default timeout
	timeout: false,

	/*
	 * Mark a test as finished.
	 * Calling `done` more than
	 * once does nothing.
	 **/
	done: function () {
		return this._terminate();
	},

	/*
	 * Permanently fail a test,
	 * preventing `done` from firing.
	 **/
	fail: function (e) {
		e = typeof e === 'object' ? e : new Error(e);
		e.message = e.message || 'No error message.';

		return this._terminate(e);
	},

	/*
	 * End the test, and set `error`
	 * if there is one.
	 **/
	_terminate: function (error) {
		if (this._.test.ended) {
			return this;
		}
		this._.test.ended = true;

		panic.connection.emit('event', 'done', {
			testID: this._.test.ID,
			clientID: panic.clientID,
			error: error && {
				message: error.message
			}
		});

		console.log('Test finished.');

		panic.emit('done');

		return this;
	}
};

module.exports = Context;
