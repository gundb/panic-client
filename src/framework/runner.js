/*jslint node: true*/
'use strict';

var Context = require('./Context');

module.exports = function (test) {
	if (!test) {
		return;
	}
	var ctx = new Context(test);

	test.config.cbs.forEach(function (cb) {
		cb.call(ctx, ctx, ctx.done);
	});
};
