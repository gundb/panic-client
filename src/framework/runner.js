/*jslint node: true*/
'use strict';

var Context = require('./Context');
var panic = require('./panic');
var tests = {};

function runner(test) {
	if (!test) {
		return;
	}
	var ctx = new Context(test);

	test.config.cbs.forEach(function (cb) {
		cb.call(ctx, ctx, ctx.done);
	});
}

module.exports = runner;

panic.on('test', function (TDO) {
	tests[TDO.ID] = TDO;
	var listeners = panic.listenerCount('test');

	if (listeners === 1) {
		panic.emit('ready', TDO.ID);
	}
});

panic.on('run', function (ID) {
	runner(tests[ID]);
});
