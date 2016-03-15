/*jslint node: true, evil: true*/
'use strict';

Function.parse = function (string) {
	var val;
	eval('val = ' + string);
	return val;
};

var space = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
space += 'abcdefghijklmnopqrstuvwxyz';
space += '1234567890';

// produce a random string
String.random = function (length) {
	var string = '';
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
