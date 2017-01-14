const gulp = require('gulp');
const requireDir = require('require-dir');

const browserSync = require('browser-sync');
const $ = require('gulp-load-plugins')({ lazy: true, camelize: true });

const serverConfig = require('./src/backend/module/serverConfig.js');
const utility = require('./gulpTask/utility.js');

requireDir('./gulpTask');

gulp.task('help', $.taskListing);

gulp.task('startServer', ['buildBackend', 'buildFrontend'], function() {
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
        tasks: ['buildBackend']
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

gulp.task('frontendMonitor', function() {
    let watchList = {
        scriptList: ['./src/frontend/**/*.js'],
        staticFileList: [
            './src/frontend/**/*.html',
            './src/frontend/**/*.hbs',
            './src/frontend/**/*.css',
            './src/frontend/**/*.scss'
        ]
    };
    gulp
        .watch(watchList.scriptList, ['buildFrontend'])
        .on('change', function(event) {
            setTimeout(function() {
                utility.log('File ' + event.path + ' was ' + event.type);
                browserSync.notify('伺服器重新啟動，頁面即將同步重置...');
                browserSync.reload({
                    stream: false
                });
            }, 5000);
        });
    gulp
        .watch(watchList.staticFileList, ['buildFrontend'])
        .on('change', function(event) {
            setTimeout(function() {
                utility.log('File ' + event.path + ' was ' + event.type);
                browserSync.notify('伺服器重新啟動，頁面即將同步重置...');
                browserSync.reload({
                    stream: false
                });
            }, 5000);
        });
});

gulp.task('startDevelopmentServer', ['buildBackend', 'buildFrontend', 'frontendMonitor'], function() {
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
        tasks: ['buildBackend']
    };
    return $.nodemon(nodemonOption)
        .on('start', function() {
            utility.log('*** server started on: ' + serverConfig.serverUrl);
            startBrowserSync();
        })
        .on('restart', function(event) {
            utility.log('*** server restarted and operating on: ' + serverConfig.serverUrl);
            utility.log('files triggered the restart:\n' + event);
            /*
            setTimeout(function() {
                browserSync.notify('伺服器重新啟動，頁面即將同步重置...');
                browserSync.reload({ stream: false });
            }, 5000);
            */
        })
        .on('crash', function() {
            utility.log('*** server had crashed...');
        })
        .on('shutdown', function() {
            utility.log('*** server had been shutdown...');
        });
});

function startBrowserSync() {
    if (browserSync.active) { return; }
    let option = {
        proxy: `${serverConfig.serverUrl}/${serverConfig.systemReference}/index.html`,
        port: serverConfig.browserSyncPort,
        ghostMode: { clicks: true, location: false, forms: true, scroll: true },
        // files: ['./src/frontend/**/*.*'],
        // injectChanges: true,
        // logFileChanges: true,
        logLevel: 'info', // 'debug','info','slient'
        // logPrefix: 'gulp-output',
        notify: true,
        reloadDelay: 1000,
        open: (serverConfig.development) ? 'local' : 'false'
    };
    browserSync(option);
    utility.log('start browserSync on port: ' + serverConfig.serverPort);
}
