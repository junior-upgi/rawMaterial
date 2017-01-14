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

const serverConfig = require('../src/backend/module/serverConfig.js');
const utility = require('./utility.js');

gulp.task('reset', function() {
    let buildDir = './build';
    utility.log(`remove backend files at: ${gulpUtil.colors.blue(buildDir)}`);
    let buildRemovalStream = del.sync(buildDir);

    utility.log(`remove server log outputs at: ${gulpUtil.colors.blue(serverConfig.logDir)}`);
    let logRemovalStream = del.sync(serverConfig.logDir);

    let tempDir = './temp';
    utility.log(`remove temp folder at: ${gulpUtil.colors.blue(tempDir)}`);
    let tempRemovalStream = del.sync(tempDir);

    return merge(
        buildRemovalStream,
        logRemovalStream,
        tempRemovalStream);
});

gulp.task('lint', ['reset'], function() {
    utility.log('backend code evaluation with Eslint and JSCS');
    let backendScriptList = [
        './*.js',
        './gulpTask/**/*.js',
        './src/backend/**/*.js'
    ];
    return gulp
        .src(backendScriptList)
        .pipe(gulpIf(yargs.verbose, print()))
        .pipe(jscs())
        .pipe(jscsStylish())
        .pipe(jscs.reporter('fail'))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', ['lint'], function() {
    utility.log('building backend server files...');
    return gulp
        .src('./src/backend/**/*.*')
        .pipe(gulp.dest('./build'));
});
