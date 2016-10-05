/*eslint-disable*/

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

/**
 * Take a function string and evaluate it,
 * optionally injecting local variables.
 * Includes hackery for IE6 compatibility.
 * @return {Function} - The evaluated function.
 */
module.exports = function () {
	var arguments = module.exports.arguments || arguments;
	var PANIC_CB_FUNCTION;
	with (arguments[1] || {}) {
		eval('PANIC_CB_FUNCTION = ' + arguments[0]);
		return PANIC_CB_FUNCTION;
	}
};
