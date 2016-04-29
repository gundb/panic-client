/*eslint "strict": "off", "no-with": "off", "no-eval": "off"*/

/*
	This may well be the worst code I've ever written.
	...
	but it's really cool.

	It's also the reason you should never use panic
	in user-facing code.

	The purpose of the parser is to take a stringified
	function, a scope, and return a function that has
	locally scoped variables according to the properties
	in the object (second param).
*/

module.exports = function () {
	with (arguments[1] || {}) {
		return eval('(' + arguments[0] + ')');
	}
};
