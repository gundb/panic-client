/*jslint node: true*/
'use strict';

var panic = require('./panic');

if (typeof window !== 'undefined') {
	window.panic = panic;
}

module.exports = panic;
