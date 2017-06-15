var gulp = require('gulp');
	nightwatch = require('gulp-nightwatch');

/**
* Run Nightwatch tests
* Need to change test directory and the return/exit in the above mocha tests
*/
gulp.task('nightwatch:chrome', function() {
	gulp.src('test/nightwatch_test/*.js')
    .pipe(nightwatch({
      configFile: 'nightwatch_ch.json'
    }));
});

/**
gulp.task('nightwatch:firefox', function() {
	gulp.src('test/nightwatch_test/*.js')
    .pipe(nightwatch({
      configFile: 'nightwatch_ff.json'
    }));
});
*/

/**
gulp.task('nightwatch:basic', function() {
	gulp.src('test/nightwatch_test/*.js')
    .pipe(nightwatch({
      configFile: 'nightwatch.json'
    }));
});
*/