'use strict';

const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const newer = require('gulp-newer'); // измененные файлы

const fileinclude = require('gulp-file-include');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const mmq = require('gulp-merge-media-queries');

const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');

const imagemin = require('gulp-imagemin');

const browserSync = require('browser-sync').create();

// const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

//-----html------
gulp.task('html', function () {
  return gulp.src(['src/*.html'])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      }))
      .pipe(gulp.dest('build'));
});


//-----styles------
gulp.task('styles', function () {
  // const postcssOptions = [require('autoprefixer'), require('cssnano')];
  const postcssOptions = [autoprefixer, cssnano];

  return gulp.src('src/scss/styles.scss')
      .pipe(sass())
      .pipe(mmq({log: true}))
      .pipe(postcss(postcssOptions))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('build/css'));
});

gulp.task('styles-dev', function () {
  return gulp.src('src/scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(mmq({log: true}))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'));
});

//-----script------
gulp.task('script', function () {
  return gulp.src('src/js/scripts.js')
    .pipe(rigger())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/js'));
});

gulp.task('script-dev', function () {
  return gulp.src('src/js/scripts.js')
    .pipe(rigger())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/js'));
});

//-----images------
gulp.task('images', function () {
  return gulp.src(['src/images/**/*.{png,jpg,gif}'], {since: gulp.lastRun('images')})
      .pipe(newer('build/images'))
      .pipe(imagemin())
      .pipe(gulp.dest('build/images'));
});

gulp.task('images-dev', function () {
  return gulp.src(['src/images/**/*.{png,jpg,gif}'], {since: gulp.lastRun('images')})
      .pipe(newer('build/images'))
      .pipe(gulp.dest('build/images'));
});

gulp.task('images-svg', function () {
  return gulp.src(['src/images/**/*.svg'], {since: gulp.lastRun('images')})
      .pipe(newer('build/images'))
      .pipe(gulp.dest('build/images'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: 'build'
  });

  browserSync.watch('build/**/*.*').on('change', browserSync.reload)
});


//-----clear build------
gulp.task('clear', function () {
  return del(['build']);
});

gulp.task('build', gulp.series(
    'clear',
    gulp.parallel('html', 'styles', 'script', 'images', 'images-svg')
));

gulp.task('watch', function () {
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/scss/**/*.*', gulp.series('styles-dev'));
  gulp.watch('src/js/*.*', gulp.series('script-dev'));
  gulp.watch('src/images/**/*.{png,jpg,gif}', gulp.series('images-dev'));
  gulp.watch('src/images/**/*.svg', gulp.series('images-svg'));
});

gulp.task('dev', gulp.series(
  'clear',
  gulp.parallel('html', 'styles-dev', 'script-dev', 'images-dev', 'images-svg', 'watch', 'serve')
));
