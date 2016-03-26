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
		try {
			cb.call(ctx, ctx, ctx.done);
		} catch (e) {
			ctx.fail(e);
		}
	});
}

module.exports = runner;

panic.on('test', function (TDO) {
	tests[TDO.ID] = TDO;
	var listeners = panic.listenerCount('test');
	console.log(TDO);

	if (listeners === 1) {
		panic.connection.emit('ready', TDO.ID);
	}
});

panic.on('run', function (ID) {
	console.log('Running test "' + tests[ID].description + '"');
	runner(tests[ID]);
});
