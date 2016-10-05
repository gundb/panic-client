/*eslint "no-eval": "off", "id-length": "off"*/
'use strict';
var panic = require('./panic');
var parse = require('./parser');

/** Shared state across all jobs.*/
var state = {};

// Function.prototype.bind
require('phantomjs-polyfill');

/**
 * Add more debugging data to stringified errors.
 * @return {Object} - An object safe to send over the wire.
 */
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
/**
 * Get the number of parameters a function
 * is expecting in a IE6-safe manner.
 * @param  {String} raw - A stringified function.
 * @return {Number} - The number of parameters it's expecting.
 */
function params (raw) {

	/** Capture the arguments group. */
	var parens = raw.match(/\((.*?)\)/);

	/** Grab that group. */
	var args = parens && parens[1];

	if (args && args.length) {

		/** If there are arguments, count the commas. */
		return args.split(',').length;
	}

	/** Otherwise, no params. */
	return 0;
}

/**
 * Run a stringified function as a job and
 * report errors or successful completion.
 * @param {String} raw - A stringified function.
 * @param {String} id - A unique job ID.
 * @param {Object} [scope] - Properties associated
 * with the job.
 * @class Job
 */
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

	/**
	 * Allow done and fail to be called indifferent
	 * of the `this` context.
	 */
	this.done = this.done.bind(this);
	this.fail = this.fail.bind(this);

	try {

		/** If async, pass the done callback. */
		if (params(raw) > 0) {
			cb.call(this, this.done);
		} else {

			/** If sync, call done after. */
			cb.call(this);
			this.done();
		}
	} catch (err) {

		/** Catch sync errors and report them. */
		this.fail(err);
	}
}

Job.prototype = {
	constructor: Job,

	socket: null,
	data: null,
	platform: panic.platform,

	/**
	 * Set a client-relative job timeout. Fails
	 * the job if it hasn't terminated by the timeout.
	 * @param  {Number} time - The milliseconds to fail after.
	 * @return {this} - The current context.
	 */
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

	/**
	 * Report the job as successful.
	 * @return {this} - The current context.
	 */
	done: function () {
		return this._terminate();
	},

	/**
	 * Report job failure.
	 * @param  {Mixed} error
	 * If an error is passed, it's extended and reported.
	 * If a string is passed, it's used as the
	 * error message.
	 * If nothing is passed, a default message is assigned.
	 * @return {this} - The current context.
	 */
	fail: function (error) {

		/** Make sure it's an error object. */
		if (!(error instanceof Object)) {
			error = new Error(error);
		}

		/** Set a default error message. */
		error.message = error.message || 'No error message.';

		/** Extend the error for better debugging. */
		error.source = error.source || this.toSource();

		return this._terminate({
			error: error
		});
	},

	/**
	 * Send a report back to the server. Can be
	 * success or failure, and ensures the report
	 * is only sent once.
	 * @param  {Object} [result] - The report to send.
	 * @return {this} - The current context.
	 */
	_terminate: function (result) {

		/** Stop if the job already terminated. */
		if (this._.ended) {
			return this;
		}

		/** Create a report if there is none. */
		var report = result || {};
		this._.ended = true;

		/** Emit back on the job ID. */
		panic.connection.emit(this._.id, report);

		return this;
	},

	/**
	 * Gets the stringified function the job was
	 * created from.
	 * @return {String} - The source function.
	 */
	toSource: function () {
		return this._.raw;
	}
};

module.exports = Job;
