const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

const paths = {
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css'
  },
  js: {
    src: 'src/js/**/*.js',
    dest: 'dist/js'
  },
  html: {
    src: 'src/html/**/*.html',
    dest: 'dist'
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images'
  }
};

function styles() {
  return gulp.src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

function images() {
  return gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch(paths.scss.src, styles);
  gulp.watch(paths.js.src, scripts);
  gulp.watch(paths.html.src, html);
  gulp.watch(paths.images.src, images);
}

exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.watch = watch;
exports.build = gulp.parallel(styles, scripts, html, images);
exports.default = gulp.series(exports.build, watch);
