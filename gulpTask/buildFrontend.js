const del = require('del');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const jscs = require('gulp-jscs');
const jscsStylish = require('gulp-jscs-stylish');
const print = require('gulp-print');
const gulpUtil = require('gulp-util');
const merge = require('merge-stream');
const yargs = require('yargs').argv;

// transpiling and concatnation specific
const babelify = require('babelify');
const browserify = require('browserify');
const eventStream = require('event-stream');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

// css, sass related
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cssMinify = require('gulp-minify-css');

const utility = require('./utility.js');

require('./html.js');
require('./style.js');
require('./transpile.js');

gulp.task('reset', function() {
    let publicDir = './public';
    utility.log(`remove frontend files at: ${gulpUtil.colors.blue(publicDir)}`);
    return del.sync(publicDir);
});

gulp.task('lint', ['reset'], function() {
    utility.log('frontend code evaluation with Eslint and JSCS');
    let frontendScriptList = [
        './*.js',
        './gulpTask/**/*.js',
        './src/frontend/**/*.js'
    ];
    return gulp
        .src(frontendScriptList)
        .pipe(gulpIf(yargs.verbose, print()))
        .pipe(jscs())
        .pipe(jscsStylish())
        .pipe(jscs.reporter('fail'))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('transpile', ['lint'], function() {
    utility.log('ES6 code transpile, bundling and uglify...');
    let entryPointList = [
        './src/frontend/js/index.js'
    ];
    let destDir = './public/js';
    let taskList = entryPointList.map(function(entryPoint) {
        return browserify(entryPoint, {
                debug: true
            }).transform(babelify, {
                presets: ['es2015'],
                sourceMaps: true
            }).bundle()
            .on('error', function(error) {
                console.error(error);
            })
            .pipe(source(entryPoint.slice(18)))
            .pipe($.rename({
                extname: '.bundle.js'
            }))
            .pipe(buffer())
            .pipe($.sourcemaps.init({
                loadMaps: true
            }))
            .pipe(uglify({
                mangle: false,
                compress: {
                    sequences: false
                }
            }))
            .pipe($.sourcemaps.write('./', {
                sourceRoot: './src/frontend'
            }))
            .pipe(gulp.dest(destDir));
    });
    return eventStream.merge.apply(null, taskList);
});

gulp.task('style', function() {
    utility.log('processing SASS files');
    let scssSourceDir = './src/frontend/css/*.scss';
    let scssStream = gulp.src(scssSourceDir)
        .pipe(sass())
        .pipe(concat('mergedScss.scss'));

    utility.log('processing static CSS files');
    let cssSourceDir = './src/frontend/css/*.css';
    let cssStream = gulp.src(cssSourceDir)
        .pipe(concat('mergedCss.css'));

    let destDir = './public/css';
    let mergedStream = merge(scssStream, cssStream)
        .pipe(concat('style.css'))
        .pipe(cssMinify())
        .pipe(gulp.dest(destDir));

    return mergedStream;
});

gulp.task('build', ['transpile', 'style'], function() {
    utility.log('process handlebars templates');
    let hbsSource = './src/frontend/**/*.hbs';
    let hbsDestDir = './public';
    let hbsStream = gulp
        .src(hbsSource)
        .pipe(gulp.dest(hbsDestDir));

    utility.log('process favicon');
    let faviconSource = './src/frontend/*.png';
    let faviconDestDir = './public';
    let faviconStream = gulp
        .src(faviconSource)
        .pipe(gulp.dest(faviconDestDir));

    utility.log('process static html');
    let htmlSource = './src/frontend/**/*.html';
    let htmlDestDir = './public';
    let htmlStream = gulp
        .src(htmlSource)
        .pipe(gulp.dest(htmlDestDir));

    return merge(hbsStream, faviconStream, htmlStream);
});
