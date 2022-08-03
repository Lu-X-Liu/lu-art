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

// optimize thumbnail images
function optimizeThumbImgs(cb) {
    sizes.forEach(function (size, key ) { 
      src('dist/imgs/thumbnails/' + 't-' + key + '/*.jpg', {since: lastRun(optimizeThumbImgs)})
      .pipe(imagemin([
        imagemin.mozjpeg({quality:80, progressive: true}),
        imagemin.optipng({optimizationLevel: 2})
      ]))
      .pipe(dest('dist/imgs/thumbnails/' + 't-' + key + '/'))
      .pipe(browserSync.stream());
    });
    cb();  
}

// create webp for thumbnail images
function webpThumbImgs(cb) {
    sizes.forEach(function (sizes, key) {
        src('dist/imgs/thumbnails/' + 't-' + key + '/*.jpg', {since: lastRun(webpThumbImgs)})
        .pipe(webp())
        .pipe(dest('dist/imgs/thumbnails/t-webp/' + 'w-' + key + '/'))
        .pipe(browserSync.stream());        
    })
    cb();
}

//resize light-box display images

const displayImgs = {};
const landscape = new Map([
    ['small', 800],
    ['medium', 1080],
    ['large', 1400],
    ['xlarge', 1655]
]);
const portrait = new Map([
    ['small', 800],
    ['large', 1350]
]);
const bio = new Map([
    ['small', 800],
    ['large', 1200]
]);

displayImgs['landscape'] = landscape;
displayImgs['portrait'] = portrait;
displayImgs['bio'] = bio;

const srcDirPath = 'src/imgs/display/';
const distDirPath = 'dist/imgs/display/';

function resizeDisplayImgs(cb) {
    for (const item in displayImgs) {
        if (item === 'landscape') {
            displayImgs[item].forEach((size, key) => {
                src(srcDirPath + 'landscape/*.jpg', {since: lastRun(resizeDisplayImgs)})
                .pipe(        
                    imgResize({
                    width: size
                }))
                .pipe(rename(function (path) {
                    path.basename += '_' + key;
                }))
                .pipe(dest(distDirPath + 'd-' + key + '/' ))
                .pipe(browserSync.stream());
            })            
        } else if (item === 'portrait') {
            displayImgs[item].forEach((size, key) => {
                if (key === 'small') {
                    src(srcDirPath + 'portrait/*.jpg', {since: lastRun(resizeDisplayImgs)})
                    .pipe(        
                        imgResize({
                        width: size
                    }))
                    .pipe(rename(function (path) {
                        path.basename += '_' + key;
                    }))
                    .pipe(dest(distDirPath + 'd-' + key + '/' )) 
                    .pipe(browserSync.stream());                   
                } else if (key === 'large') {
                    src(srcDirPath + 'portrait/*.jpg', {since: lastRun(resizeDisplayImgs)})
                    .pipe(        
                        imgResize({
                        height: size
                    }))
                    .pipe(rename(function (path) {
                        path.basename += '_' + key;
                    }))
                    .pipe(dest(distDirPath + 'd-' + key + '/' )) 
                    .pipe(browserSync.stream());  
                }
                
            })
        } else if (item === 'bio') {
            displayImgs[item].forEach((size, key) => {
                src(srcDirPath + 'bio/*.jpg', {since: lastRun(resizeDisplayImgs)})
                .pipe(        
                    imgResize({
                    width: size
                }))
                .pipe(rename(function (path) {
                    path.basename += '_' + key;
                }))
                .pipe(dest(distDirPath + 'd-' + key + '/' ))
                .pipe(browserSync.stream());                
            })
        }
    }
    cb();
}

//optimise display images
const displayImgSizes = ['d-small', 'd-medium', 'd-large', 'd-xlarge'];

function optimizeDisplayImgs(cb) {
    displayImgSizes.forEach((size) => {
        src('dist/imgs/display/' + size + '/*.jpg', {since: lastRun(optimizeDisplayImgs)})
        .pipe(imagemin([
        imagemin.mozjpeg({quality:75, progressive: true})
        ]))
        .pipe(dest('dist/imgs/display/' + size + '/'))
        .pipe(browserSync.stream());       
    })
    cb();
}

// const singleImgSizes = ['large', 'xlarge'];

// function optimizeSingleImg(cb) {
//     singleImgSizes.forEach((size) => {
//         src('dist/imgs/display/' + 'd-'+ size +'/' + 'the-training-right_' + size +'.jpg')
//         .pipe(imagemin([
//         imagemin.mozjpeg({quality: 60, progressive: true})
//         ]))
//         .pipe(dest('dist/imgs/display/' +'d-' + size + '/'));    
//     })
//     cb();
// }

//create webp for display images

// function webpDisplayImgs(cb) {
//     displayImgSizes.forEach((size) => {
//     src('dist/imgs/display/' + size + '/*.jpg')
//     .pipe(webp())
//     .pipe(dest('dist/imgs/display/d-webp/' + size + '/'))
//     //.pipe(browserSync.stream())
//      cb();          
//     })      
// }


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
    watch('./src/imgs/thumbnails/*.jpg', resizeThumbnails);
    watch('./dist/imgs/thumbnails/*.jpg', optimizeThumbImgs);
    watch('./dist/imgs/**/*.jpg', webpThumbImgs);
    watch('./src/imgs/display/*.jpg', resizeDisplayImgs);    
}

//default gulp
exports.default = series(
    scssTask,
    js,
    resizeThumbnails,
    optimizeThumbImgs,
    resizeDisplayImgs,   
    webpThumbImgs,
    watchTask
);

exports.watch = watchTask;

exports.r = resizeDisplayImgs;

exports.o = optimizeDisplayImgs;

//exports.os = optimizeSingleImg;

exports.w = webpDisplayImgs;
