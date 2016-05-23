var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var pkg = require('./package.json');
var dirs = pkg['directories'];
var sass = require('gulp-sass');

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

gulp.task('clean', function () {
    return del(dirs.dist);
});

gulp.task('copy', ['copy:misc', 'copy:normalize']);

gulp.task('copy:misc', function () {
    return gulp.src([
        // Copy all files
        dirs.src + '/**/*',
        // Exclude the following files (other tasks will handle the copying of these files)
        '!' + dirs.src + '/sass/**/*.scss'
    ], {
        // Include hidden files by default
        dot: true
    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('copy:normalize', function () {
    return gulp.src('node_modules/normalize-css/normalize.css')
        .pipe(gulp.dest(dirs.dist + '/css/'));
});

gulp.task('sass', function () {
    return gulp.src(dirs.src + '/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dirs.dist + '/css/'))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', function() {
    browserSync.init({
        server: dirs.dist
    });
    gulp.watch(dirs.src + "/*.html", ['copy', browserSync.reload]);
    gulp.watch(dirs.src + '/!(sass)/**/*', ['copy', browserSync.reload]);
    gulp.watch(dirs.src + '/sass/**/*.scss', ['sass']);
});

gulp.task('build', function (done) {
     return runSequence('clean', ['sass', 'copy'], done);
});

gulp.task('default', function(){
    runSequence('build', 'serve');
});
