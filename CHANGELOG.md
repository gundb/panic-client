# Changelog

## Unreleased
### Changed
- Jobs emit a report when finished, instead of an error or nothing. This gives the report details space to grow in the future.

## v0.3.0
### Added
- Shared job state with `this.set` and `this.get`.

### Removed
- `panic.js` build from git. It'll still be published on npm.

## v0.2.0
### Changed
- The `done` callback is now the 1st parameter passed to peers instead of the second.
- Variable injection no longer happens by default, and the flag has changed to `'@scope'`.

### Added
- IE6 compatibility by adding polyfills (`arguments`, `function.length`, `eval` variable assignment over function expressions).

## v0.1.2
### Fixed
- Previous version build not updated.

## v0.1.1
### Added
- `platform` object now accessible to jobs as `this.platform`.

## v0.1.0
Initial release.
