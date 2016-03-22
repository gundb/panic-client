/*jslint node: true*/
'use strict';

var panic = require('./framework/panic');

if (typeof window !== 'undefined') {
	window.panic = panic;
}

module.exports = panic;
