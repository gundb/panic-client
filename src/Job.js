/*eslint "no-eval": "off", "id-length": "off"*/
'use strict';
var panic = require('./panic');
var parse = require('./parser');

/** Shared state across all jobs.*/
var state = {};

// Function.prototype.bind
require('phantomjs-polyfill');

Error.prototype.toJSON = function () {
	return {
		message: this.message,
		source: this.source || null,
		platform: panic.platform
	};
};

/*
	Sadly, since IE6 doesn't support
	Function.prototype.length (or getters),
	this is a simple "polyfill".
*/
function params (raw) {
	var parens = raw.match(/\((.*?)\)/);
	var args = parens && parens[1];
	if (args && args.length) {
		return args.split(',').length;
	}
	return 0;
}

function Job(raw, id, scope) {
	if (!(this instanceof Job)) {
		return new Job(raw, id, scope);
	}
	this._ = {
		raw: raw,
		id: id
	};
	this.data = scope || {};

	var cb;
	if (this.data['@scope'] === true) {
		cb = parse(raw, this.data);
	} else {
		cb = parse(raw, {});
	}

	this.done = this.done.bind(this);
	this.fail = this.fail.bind(this);

	try {
		if (params(raw) > 0) {
			cb.call(this, this.done);
		} else {
			cb.call(this);
			this.done();
		}
	} catch (err) {
		this.fail(err);
	}
}

Job.prototype = {
	constructor: Job,

	socket: null,
	data: null,
	platform: panic.platform,

	// default timeout
	timeout: function (time) {
		var job = this;
		setTimeout(function () {
			job.fail('Timeout reached: ' + time + 'ms');
		}, time);
		return job;
	},

	/**
	 * Sets a value into a shared state object.
	 *
	 * @param  {String} key - A name for the value.
	 * @param  {Mixed} value - The variable to expose to other jobs.
	 * @returns {Mixed} - The value you just set.
	 */
	set: function (key, value) {
		state[key] = value;
		return value;
	},

	/**
	 * Looks up variables in an object shared by all jobs.
	 *
	 * @param  {String} key - The name of the value.
	 * @returns {Mixed} - The value, if found (otherwise `undefined`).
	 */
	get: function (key) {
		if (state.hasOwnProperty(key) === false) {
			return undefined;
		}
		return state[key];
	},

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
	fail: function (error) {

		if (!(error instanceof Object)) {
			error = new Error(error);
		}

		error.message = error.message || 'No error message.';
		error.source = error.source || this.toSource();

		return this._terminate({
			error: error
		});
	},

	/*
	 * End the test
	 **/
	_terminate: function (result) {
		if (this._.ended) {
			return this;
		}

		var report = result || {};
		this._.ended = true;
		panic.connection.emit(this._.id, report);

		return this;
	},

	toSource: function () {
		return this._.raw;
	}
};

module.exports = Job;
