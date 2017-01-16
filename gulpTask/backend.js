const del = require('del');
const gulp = require('gulp');
// const runSequence = require('run-sequence');
const yargs = require('yargs').argv;

const serverConfig = require('../src/backend/module/serverConfig.js');
const utility = require('./utility.js');

const $ = require('gulp-load-plugins')({ lazy: true, camelize: true });

gulp.task('removeBuildFiles', function() {
    let buildDir = './build';
    utility.log(`remove backend files at: ${$.util.colors.blue(buildDir)}`);
    return del.sync(buildDir, { force: true });
});

gulp.task('removeTempFiles', function() {
    let logFileList = `./${serverConfig.logDir}/**/*`;
    // let logDir = `./${serverConfig.logDir}`;
    let tempDir = './temp';
    let dirList = [logFileList, tempDir];
    // let dirList = [logDir, tempDir];
    utility.log(`remove backend files at: ${$.util.colors.blue(dirList)}`);
    return del.sync(dirList, { force: true });
});

gulp.task('lintBackendFiles', function() {
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

gulp.task('completeBackendRebuild', ['removeBuildFiles', 'removeTempFiles', 'lintBackendFiles'], function() {
    utility.log('building backend server files...');
    return gulp
        .src('./src/backend/**/*')
        .pipe(gulp.dest('./build'));
});
