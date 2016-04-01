/*jslint node: true*/
'use strict';

// provides `Function.parse`
require('../../src/configuration/extensions');



function cbs(config) {
	if (!config.cbs) {
		return [];
	}
	return config.cbs.filter(function (obj) {


		// immediate pass
		if (obj.conditional === undefined) {
			return true;
		}

		// parse the conditional
		var result = Function.parse(obj.conditional);

		// if it's a primitive
		if (typeof result !== 'function') {
			return Boolean(result);
		}

		// it's a function
		return result.call(config, config);
	}).map(function (obj) {
		// parse the callbacks
		return Function.parse(obj.cb);
	}).filter(function (cb) {
		// filter out non-functions
		return typeof cb === 'function';
	});
}

module.exports = function (TDO) {
	TDO.config.cbs = cbs(TDO.config);
	return TDO;
};