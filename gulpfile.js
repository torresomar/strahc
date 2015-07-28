// Include gulp
var gulp = require('gulp');
// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var babel = require('gulp-babel');
var useref = require('gulp-useref');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var react = require('gulp-react');
var reactify = require('reactify');
var gulpFilter = require('gulp-filter');

var path = {
    HTML: ['app/*.html'],
    JS:   ['app/scripts/**/*.js','app/scripts/*.js'],
    CSS:  ['app/styles/**/*.css','app/styles/*.css','app/styles/**/*.scss','app/styles/*.scss']
};

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./dist/"
        }
    });
});

gulp.task('bs-reload', function () {
      browserSync.reload();
});

gulp.task('lint', function() {
    return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('styles', function() {
    var cssFilter = gulpFilter('app/bower_components/**/*.css');
    return gulp.src(path.CSS)
    .pipe(sass({
        style: 'expanded',
        precision: 10,
        loadPath: ['app/bower_components']
    }))
    .pipe(concat('application.css'))
    // .pipe(rename({suffix: '.min'}))
    // .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'sass & minify transformation done' }));
});

gulp.task('html', function(){
    return gulp.src(path.HTML)
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

var bundler = browserify({
    entries: ['app/scripts/main.js'],
    debug: true,
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true
});

function rebundle(){
    return bundler.bundle()
    .pipe(source('application.js'))
    .pipe(gulp.dest('dist/scripts'))
    .on('end', function(){
        browserSync.reload();
    });
}

gulp.task('scripts', rebundle);

gulp.task('default', ['browser-sync','styles','scripts','html'], function(){
    gulp.watch(path.CSS,  ['styles']);
    gulp.watch(path.JS,   ['scripts']);
    gulp.watch(path.HTML, ['html','bs-reload']);
});
