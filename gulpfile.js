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
var react = require('gulp-react');

var path = {
    HTML: 'app/index.html',
    JS: ['app/scripts/**/*.js','app/scripts/*.js']
};

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('app/styles/scss/**/*.scss')
    .pipe(concat('application.css'))
    .pipe(sass())
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'sass & minify transformation done' }));
});
// Tranform JSX
gulp.task('transform', function(){
    return gulp.src(path.JS)
            .pipe(react())
            .pipe(gulp.dest('dist/scripts'));
});
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});
// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
