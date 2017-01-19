const gulp = require('gulp');
// const merge = require('merge-stream');
const requireDir = require('require-dir');

const browsersync = require('browser-sync');
// const runSequence = require('run-sequence');
const $ = require('gulp-load-plugins')({ lazy: true, camelize: true });

const serverConfig = require('./src/backend/module/serverConfig.js');
const utility = require('./gulpTask/utility.js');

const nodemonOption = {
    script: './build/server.js',
    delayTime: 0,
    env: {
        'PORT': serverConfig.serverPort,
        'NODE_ENV': serverConfig.development ? 'development' : 'production'
    },
    verbose: false,
    ext: 'html js hbs',
    watch: ['./src/backend'],
    tasks: ['completeBackendRebuild']
};

const browsersyncOption = {
    proxy: `${serverConfig.serverUrl}/${serverConfig.systemReference}/index.html`,
    port: serverConfig.browsersyncPort,
    ghostMode: { clicks: true, location: false, forms: true, scroll: true },
    logPrefix: 'gulp-output',
    injectChanges: true,
    notify: true,
    reloadDelay: 1000,
    open: (serverConfig.development) ? 'local' : 'false'
};

requireDir('./gulpTask');

gulp.task('help', $.taskListing);

gulp.task('startDevelopmentServer', [
    'completeBackendRebuild',
    'transpileFrontendFiles',
    'compileStylingFiles',
    'buildFrontendStaticFiles'
], function() {
    $.nodemon(nodemonOption)
        .on('start', function() {
            utility.log($.util.colors.red(`*** server started on: ${serverConfig.serverUrl}`));
            startbrowsersync();
        })
        .on('restart', function(event) {
            utility.log($.util.colors.red(`*** server restarted and operating on: ${serverConfig.serverUrl}`));
            utility.log($.util.colors.red(`files triggered the restart: ${event}`));
        })
        .on('crash', function() { utility.log($.util.colors.red('*** server had crashed...')); })
        .on('shutdown', function() { utility.log($.util.colors.red('*** server had been shutdown...')); });

    gulp
        .watch(['./src/frontend/js/**/*.js'], ['transpileFrontendFiles'])
        .on('change', function(event) {
            browsersync.notify('程式碼變更，頁面即將再重編後同步重置...');
            utility.log($.util.colors.red(`File ${event.path} was ${event.type}`));
        });
    gulp
        .watch(['./src/frontend/**/*.css', './src/frontend/**/*.scss'], ['compileStylingFiles'])
        .on('change', function(event) {
            browsersync.notify('樣式碼變更，頁面即將再重編後同步重置...');
            utility.log($.util.colors.red(`File ${event.path} was ${event.type}`));
        });
    gulp
        .watch(['./src/frontend/**/*.html', './src/frontend/**/*.hbs', './src/frontend/**/*.vue'], ['buildFrontendStaticFiles'])
        .on('change', function(event) {
            browsersync.notify('HTML markup 變更，頁面即將再重編後同步重置...');
            utility.log($.util.colors.red(`File ${event.path} was ${event.type}`));
        });
});

function startbrowsersync() {
    if (browsersync.active) { return; }
    browsersync(browsersyncOption);
    utility.log($.util.colors.red(`start browsersync on port: ${serverConfig.browsersyncPort}`));
}

/*
gulp.task('startServer', ['completeBackendRebuild', 'completeFrontendRebuild'], function() {
    let nodemonOption = {
        script: './build/server.js',
        delayTime: 1,
        env: {
            'PORT': serverConfig.serverPort,
            'NODE_ENV': serverConfig.development ? 'development' : 'production'
        },
        verbose: false,
        ext: 'html js hbs',
        watch: ['./src/backend/'],
        tasks: ['completeBackendRebuild']
    };
    return $.nodemon(nodemonOption)
        .on('start', function() {
            utility.log('*** server started on: ' + serverConfig.serverUrl);
        })
        .on('restart', function(event) {
            utility.log('*** server restarted and operating on: ' + serverConfig.serverUrl);
            utility.log('files triggered the restart:\n' + event);
        })
        .on('crash', function() {
            utility.log('*** server crashed...');
        })
        .on('shutdown', function() {
            utility.log('*** server had been shutdown...');
        });
});
*/
