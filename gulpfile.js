/*jslint node: true*/
'use strict';

var gulp = require('gulp');
var webpack = require('webpack-stream');
var watch = require('gulp-watch');

var options = {
	output: {
		filename: 'panic.js'
	}
};

gulp.task('default', function () {
	watch('src/*', function () {
		gulp.src('src/index.js')
			.pipe(webpack(options))
			.pipe(gulp.dest('./'));
	});
});
