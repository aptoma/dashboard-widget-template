/* global require */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pkg = require('./package');
var del = require('del');
var _ = require('lodash');

var config = {
    port: 3000,
    build: 'build',
    dist: 'build/dist',
    tmp: 'build/tmp',
    tpl: 'src/widget/*.html',
    js: [
      'src/**/*.js',
      '!src/vendor/**/*.js'
    ],
    widget: 'src/widget/**/*.js',
    index: 'src/index.html'
};

//generate angular templates using html2js
gulp.task('templates', function () {
    return gulp.src(config.tpl)
        .pipe($.changed(config.tmp))
        .pipe($.html2js({
            outputModuleName: 'templates',
            base: 'client',
            useStrict: true
        }))
        .pipe($.concat('templates.js'))
        .pipe(gulp.dest(config.tmp))
        .pipe($.size({
            title: 'templates'
        }));
});

//build files for creating a dist release
gulp.task('build:dist', ['clean'], function (cb) {
    runSequence(['jshint', 'build', 'html'], 'concat', cb);
});

//build files for development
gulp.task('build', ['clean'], function (cb) {
    runSequence(['templates'], cb);
});

gulp.task('concat', function () {
    return gulp.src(config.tmp + '/*.js')
        .pipe($.concat('widget.dist.js'))
        .pipe(gulp.dest(config.dist));
});

gulp.task('html', function () {
    return gulp.src(config.widget)
        .pipe($.sourcemaps.init())
        .pipe($.if('*.js', $.ngAnnotate()))
        .pipe($.if('*.js', $.uglify({
            mangle: false,
        })))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(config.tmp))
        .pipe($.size({
            title: 'html'
        }));
});

//clean temporary directories
gulp.task('clean', del.bind(null, [config.build]));

//lint files
gulp.task('jshint', function () {
    return gulp.src(config.js)
        .pipe(reload({
            stream: true,
            once: true
        }))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

/* tasks supposed to be public */


//default task
gulp.task('default', ['serve']); //

//run the server after having built generated files, and watch for changes
gulp.task('serve', ['build'], function () {
    browserSync({
        notify: false,
        logPrefix: pkg.name,
        server: ['build', 'src']
    });

    gulp.watch(config.index, reload);
    gulp.watch(config.js, ['jshint']);
    gulp.watch(config.tpl, ['templates', reload]);
});