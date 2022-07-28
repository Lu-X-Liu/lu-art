// list dependences
const { src, dest, watch, series, lastRun } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const terser = require('gulp-terser');
const imgResize = require('gulp-image-resize'); 
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

// resize images
const sizes = new Map([
    ['small', 400],
    ['medium', 500],
    ['large', 600]
]);

function resizeThumbnails (cb) {
    sizes.forEach(function (size, key) {
        src('src/imgs/thumbnails/*.jpg', {since: lastRun(resizeThumbnails)})
        .pipe(imgResize({
            width: size
        }))
        .pipe(rename(function (path) {
            path.basename += '_' + key;
        }))
        .pipe(dest('dist/imgs/thumbnails/t-' + key + '/' ))
        .pipe(browserSync.stream());
    });
    cb();
}

//resize full imgs
// const fullImgs = new Map([

// ]);

// optimize images
function optimizeImgs(cb) {
    sizes.forEach(function (size, key ) { 
      src('dist/imgs/thumbnails/' + 't-' + key + '/*.jpg', {since: lastRun(optimizeImgs)})
      .pipe(imagemin([
        imagemin.mozjpeg({quality:80, progressive: true}),
        imagemin.optipng({optimizationLevel: 2})
      ]))
      .pipe(dest('dist/imgs/thumbnails/' + 't-' + key + '/'))
      .pipe(browserSync.stream());
    });
    cb();  
}
//create webp
function webpImgs(cb) {
    sizes.forEach(function (sizes, key) {
        src('dist/imgs/thumbnails/' + 't-' + key + '/*.jpg', {since: lastRun(webpImgs)})
        .pipe(webp())
        .pipe(dest('dist/imgs/thumbnails/t-webp/' + 'w-' + key + '/'))
        .pipe(browserSync.stream());        
    })
    cb();
}
//watchtask
function watchTask() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    watch('./src/scss/**/*.scss', scssTask);
    watch('./**/*.html').on('change', browserSync.reload);
    watch('./src/js/**/*.js', js);
    watch('./src/imgs/**/*.jpg', resizeThumbnails);
    watch('./src/imgs/**/*.{jpg,png.svg}', optimizeImgs);
    watch('./dist/imgs/**/*.jpg', webpImgs);
}

//default gulp
exports.default = series(
    scssTask,
    js,
    resizeThumbnails,
    optimizeImgs,
    webpImgs,
    watchTask
);

exports.watch = watchTask;