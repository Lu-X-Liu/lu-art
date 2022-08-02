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
// function optimizeImgs(cb) {
//     sizes.forEach(function (size, key ) { 
//       src('dist/imgs/thumbnails/' + 't-' + key + '/*.jpg', {since: lastRun(optimizeImgs)})
//       .pipe(imagemin([
//         imagemin.mozjpeg({quality:80, progressive: true}),
//         imagemin.optipng({optimizationLevel: 2})
//       ]))
//       .pipe(dest('dist/imgs/thumbnails/' + 't-' + key + '/'))
//       .pipe(browserSync.stream());
//     });
//     cb();  
// }

//resize light-box display images
const displayImgs = {
    'landscape': {
        'small': 800,
        'medium': 1080,
        'large': 1400,
        'xlarge': 1655
    },
    'portrait': {
        'small': 800, //width
        'large' : 1350 //height
    },
    'bio': {
        'small': 860,
        'large' : 1200
    }
};

const srcDirPath = 'src/imgs/display/';
const distDirPath = 'dist/imgs/display/';

function resizeDisplayImgs(cb) {
    for (const item in displayImgs) {
        const landscapeObj = displayImgs['landscape'];
        const portraitObj = displayImgs['portrait'];
        const bioObj = displayImgs['bio'];

        if (item === 'landscape') {
            for (const size in landscapeObj) {
                src(srcDirPath + 'landscape/*.jpg', {since: lastRun(resizeDisplayImgs)})
                .pipe(        
                    imgResize({
                    width: size
                }))
                .pipe(rename(function (path) {
                    path.basename += '_' + size;
                }))
                .pipe(dest(distDirPath + 'd-' + size + '/' ))
                .pipe(browserSync.stream());
            }
        }
        else if (item === 'portrait') {
            for (const size in portraitObj) {
                if (size === 'small') {
                    src(srcDirPath + 'portrait/*.jpg', {since: lastRun(resizeDisplayImgs)})
                    .pipe(imgResize({
                        width: size
                    })) 
                    .pipe(rename(function (path) {
                        path.basename += '_' + size;
                    }))
                    .pipe(dest(distDirPath + 'd-' + size + '/'))                   
                } else if (size === 'large') {
                    src(srcDirPath + 'portrait/*.jpg', {since: lastRun(resizeDisplayImgs)})
                    .pipe(imgResize({
                        height: size
                    })) 
                    .pipe(rename(function (path) {
                        path.basename += '_' + size;
                    }))
                    .pipe(dest(distDirPath + 'd-' + size + '/'))
                    .pipe(browserSync.stream());
                } else {
                    for (const size in bioObj) {
                        src(srcDirPath + 'bio/*.jpg', {since: lastRun(resizeDisplayImgs)})
                        .pipe(imgResize({
                            width: size
                        }))
                        .pipe(rename(function (path) {
                            path.basename += '_' + size;
                        }))
                        .pipe(dest(distDirPath + 'd-' + size + '/'))
                        .pipe(browserSync.stream());
                    }
                }
            }
        }
    }
    cb();
} 

//optimise all images
function optimizeImgs() {
    return  src('dist/imgs/**/*.jpg', {since: lastRun(optimizeImgs)})
      .pipe(imagemin([
        imagemin.mozjpeg({quality:80, progressive: true})
      ]))
      .pipe(dest('dist/imgs/'))
      .pipe(browserSync.stream()); 
}

//create webp

function webpImgs() {
    return    src('dist/imgs/**/*.jpg', {since: lastRun(webpImgs)})
        .pipe(webp())
        .pipe(dest('dist/imgs/'))
        .pipe(browserSync.stream());        
}

// function webpImgs(cb) {
//     sizes.forEach(function (sizes, key) {
//         src('dist/imgs/thumbnails/' + 't-' + key + '/*.jpg', {since: lastRun(webpImgs)})
//         .pipe(webp())
//         .pipe(dest('dist/imgs/thumbnails/t-webp/' + 'w-' + key + '/'))
//         .pipe(browserSync.stream());        
//     })
//     cb();
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
