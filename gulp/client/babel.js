var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("babel-client", function () {
    return gulp.src('./client/assets/native/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./dist/assets/native/js'));
});

gulp.task("babel-server", function () {
    return gulp.src('./server/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./server/'));
});
