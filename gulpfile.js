const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: true, camelize: true });
const yargs = require('yargs').argv;

const utility = require('./src/backend/module/utility.js');

gulp.task('lint', function() {
    utility.logger.info('source code evaluation with Eslint and JSCS');
    let sourceFileList = [
        './*.js',
        './src/**/*.js',
        './src/**/*.vue',
        './test/**/*.js'
    ];
    return gulp
        .src(sourceFileList)
        .pipe($.if(yargs.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jscsStylish())
        .pipe($.jscs.reporter('fail'))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});
