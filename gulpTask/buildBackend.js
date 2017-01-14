const del = require('del');
const gulp = require('gulp');
const yargs = require('yargs').argv;

// const serverConfig = require('../src/backend/module/serverConfig.js');
const utility = require('./utility.js');

const $ = require('gulp-load-plugins')({ lazy: true, camelize: true });

gulp.task('removeBuildFiles', function() {
    let buildDir = './build';
    // let logDir = `./${serverConfig.logDir}`;
    let tempDir = './temp';
    let dirList = [
        buildDir,
        // logDir,
        tempDir
    ];
    utility.log(`remove backend files at: ${$.util.colors.blue(dirList)}`);
    // return del.sync(dirList, { force: true });
    return del(dirList, { force: true });
});

gulp.task('lintBackendFiles', ['removeBuildFiles'], function() {
    utility.log('backend code evaluation with Eslint and JSCS');
    let backendScriptList = [
        './*.js',
        './gulpTask/**/*.js',
        './src/backend/**/*.js'
    ];
    return gulp
        .src(backendScriptList)
        .pipe($.if(yargs.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jscsStylish())
        .pipe($.jscs.reporter('fail'))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});

gulp.task('buildBackend', ['lintBackendFiles'], function() {
    utility.log('building backend server files...');
    return gulp
        .src('./src/backend/**/*.*')
        .pipe(gulp.dest('./build'));
});
