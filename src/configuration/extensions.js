/*jslint node: true, evil: true*/
'use strict';

Function.parse = function (string) {
	var val;
	eval('val = ' + string);
	return val;
};
