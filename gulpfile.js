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
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');

var path = {
    HTML: ['app/*.html'],
    JS: ['app/scripts/**/*.js','app/scripts/*.js'],
    CSS: ['app/styles/**/*.css','app/styles/*.css']
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

gulp.task('sass', function() {
    return gulp.src(path.CSS)
    .pipe(concat('application.css'))
    .pipe(sass())
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'sass & minify transformation done' }));
});

gulp.task('scripts', function(){
    return gulp.src(path.JS)
    .pipe(concat('application.js'))
    .pipe(babel())
    .pipe(react())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('html', function(){
    return gulp.src(path.HTML)
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['browser-sync'], function(){
    gulp.watch(path.CSS, ['styles']);
    gulp.watch(path.JS, ['scripts']);
    gulp.watch(path.HTML, ['html','bs-reload']);
});
