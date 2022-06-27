// list dependences
const { src, dest, watch, series, lastRun } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

//create functions
//scss
function scssTask() {
    return src('src/scss/*.scss', 
        [{sourcemaps: true}, 
         {since: lastRun(scssTask)}])
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix('last 2 versions'))
      .pipe(cleanCss())
      .pipe(dest('dist/css', {sourcemaps: '.'}))
      .pipe(browserSync.stream());
}
//js
function js() {
    return src('src/js/*.js', {sourcemaps: true})
      .pipe(terser())
      .pipe(rename({extname: '.min.js'}))
      .pipe(dest('dist/js', {sourcemaps: '.'}))
      .pipe(browserSync.stream());
}
// optimize images
function optimizeImgs() {
    return src('src/imgs/**/*.{jpg,png,svg}', {since: lastRun(optimizeImgs)})
      .pipe(imagemin([
        imagemin.mozjpeg({quality:80, progressive: true}),
        imagemin.optipng({optimizationLevel: 2})
      ]))
      .pipe(dest('dist/imgs'));
}
//create webp
function webpImgs() {
    return src('dist/imgs/**/*/{jpg,png}', {since: lastRun(webpImgs)})
    .pipe(webp())
    .pipe(dest('dist/imgs'));
}
//watchtask
function watchTask() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    watch('./src/scss/**/*.scss', scssTask);
    watch('./*.html').on('change', browserSync.reload);
    watch('./src/js/**/*.js', js);
    watch('./src/imgs/**/*.{jpg,png.svg}', optimizeImgs);
    watch('./dist/imgs/**/*.{jpg,png.svg}', webpImgs);
}

//default gulp
exports.default = series(
    scssTask,
    js,
    optimizeImgs,
    webpImgs,
    watchTask
);