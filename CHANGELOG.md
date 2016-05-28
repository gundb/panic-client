# Changelog

## v0.2.0
Breaking changes:
 - The `done` callback is now the 1st parameter passed to peers instead of the second.
 - Variable injection no longer happens by default, and the flag has changed to `'@scope'`.

Improvement: a number of things have changed to allow for IE6 compatibility (polyfill of arguments, function.length, and a function expression fix in `eval`).

## v0.1.2
Bug fix: previous version build not updated.

## v0.1.1
Add `platform` to the job prototype.

## v0.1.0
Initial minor release.
