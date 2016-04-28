/*eslint "no-eval": "off", "id-length": "off"*/
'use strict';
var panic = require('./panic');

Error.prototype.toJSON = function () {
	return {
		message: this.message,
		source: this.source || null,
		platform: panic.platform
	};
};

function Job(raw, id) {
	if (!(this instanceof Job)) {
		return new Job(raw, id);
	}
	this._ = {
		raw: raw,
		id: id
	};

	var cb = eval('(' + raw + ')');

	this.done = this.done.bind(this);
	this.fail = this.fail.bind(this);

	try {
		if (cb.length > 1) {
			cb.call(this, this, this.done);
		} else {
			cb.call(this, this);
			this.done();
		}
	} catch (err) {
		this.fail(err);
	}
}

Job.prototype = {
	constructor: Job,

	data: {},

	// default timeout
	timeout: function (time) {
		var job = this;
		setTimeout(function () {
			job.fail('Timeout reached: ' + time + 'ms');
		}, time);
		return job;
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
	fail: function (err) {
		err = err instanceof Object ? err : new Error(err);
		err.message = err.message || 'No error message.';
		err.source = err.source || this.toSource();

		return this._terminate(err);
	},

	/*
	 * End the test
	 **/
	_terminate: function (error) {
		if (this._.ended) {
			return this;
		}
		this._.ended = true;
		panic.connection.emit(this._.id, error);

		return this;
	},

	toSource: function () {
		return this._.raw;
	}
};

module.exports = Job;
