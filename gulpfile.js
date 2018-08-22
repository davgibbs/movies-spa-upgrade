'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync');
var jshint = require("gulp-jshint");
var html2js = require('gulp-html2js');
var minifyHtml = require("gulp-minify-html");


gulp.task("make-templates", function() {
    gulp.src('apps/movies/static/movies/partials/*.html')
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))

        .pipe(html2js('movie-templates.js', {
            adapter: 'angular',
            name: 'movieApp'
        }))
        .pipe(gulp.dest('apps/movies/static/movies/partials/'));
});

gulp.task("lint", function() {
    return gulp.src(["apps/movies/static/movies/js/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

gulp.task('default', ['lint'], function() {
    browserSync.init({
        notify: false,
        proxy: "localhost:8000"
    });

    gulp.watch('apps/movies/static/movies/partials/*.html', ['make-templates']);
    gulp.watch('apps/movies/static/movies/js/**/*.js', ['lint']);
    gulp.watch(['./**/*.{scss,css,html,py,js}'], browserSync.reload);
});

// https://dezoito.github.io/2016/01/06/django-automate-browsersync.html
