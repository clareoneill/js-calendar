/* include gulp */
var gulp = require( 'gulp' );

/* include gulp plugins */
var minify = require( 'gulp-minify-css' ),
    sass = require( 'gulp-sass' ),
    rename = require( 'gulp-rename' ),
    uglify = require( 'gulp-uglify' ),
    concat = require( 'gulp-concat' ),
    jshint = require( 'gulp-jshint' );

/* default task */
gulp.task('default', ['vendor-styles', 'sass', 'lint', 'vendor-scripts', 'scripts']);

/* minify vendor css */
gulp.task('vendor-styles', function() {
  return gulp.src('assets/styles/development/css/_vendor/*.css')
    .pipe(minify())
    .pipe(rename(function(path) {
      path.extname = '.min.css'
    }))
    .pipe(gulp.dest('assets/styles/production'));
});

/* compile sass */
gulp.task('sass', function() {
  return gulp.src('assets/styles/development/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('assets/styles/development/css'))
    .pipe(minify())
    .pipe(rename(function (path) {
      path.extname = '.min.css'
    }))
    .pipe(gulp.dest('assets/styles/production'));
});

/* lint js */
gulp.task('lint', function() {
  return gulp.src('assets/scripts/development/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/* concatenate vendor scripts */
gulp.task('vendor-scripts', function() {
  return gulp.src('assets/scripts/development/_vendor/*.js')
    .pipe(rename(function(path) {
      path.extname = '.min.js'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('assets/scripts/production'));
});

/* concatenate scripts */
gulp.task('scripts', function() {
  return gulp.src('assets/scripts/development/*.js')
    .pipe(rename(function(path) {
      path.extname = '.min.js'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('assets/scripts/production'));
});


/* watch for changes */
gulp.task('watch', ['default'], function() {
  var watchFiles = [
    'assets/styles/development/css/_vendor/*.css',
    'assets/styles/development/scss/*.scss',
    'assets/styles/development/scss/_partials/*.scss',
    'assets/scripts/development/*.js',
    'assets/scripts/development/_vendor/*.js'
  ];

  gulp.watch(watchFiles, ['default']);
});