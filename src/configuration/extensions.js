/*jslint node: true, evil: true*/
'use strict';

/*
 * Parses out functions from
 * strings. Used to parse
 * Test Description Objects.
 **/
Function.parse = function (string) {
	var val;
	eval('val = ' + string);
	return val;
};

/*
 * Produces a random string.
 * Symbol space is enclosed
 * to protect against "eval"
 * scope bleed.
 **/
String.random = function (length) {
	var string, space = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	space += (space.toLowerCase() + '1234567890');

	string = '';
	length = length || 24;
	if (length < 0) {
		return '';
	}
	while (length) {
		string += space[Math.floor(Math.random() * space.length)];
		length -= 1;
	}
	return string;
};
