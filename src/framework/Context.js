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
}

Context.prototype = {
	constructor: Context,

	// default timeout
	timeout: false,
	done: function () {
		panic.connection.emit('done', {
			testID: this._.test.ID,
			clientID: panic.clientID
		});
	},
	fail: function () {}
};

module.exports = Context;
