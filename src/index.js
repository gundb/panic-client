/*jslint node: true*/
'use strict';

var io = require('socket.io-client');

var panic;
module.exports = panic = {
	connect: function (url) {
		var socket = io.connect(url);
	}
};

if (typeof window !== 'undefined') {
	window.panic = panic;
}
