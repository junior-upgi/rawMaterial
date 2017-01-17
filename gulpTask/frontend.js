const browsersync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const merge = require('merge-stream');
// const runSequence = require('run-sequence');
const yargs = require('yargs').argv;

// transpiling and concatnation specific
const babelify = require('babelify');
const browserify = require('browserify');
const eventStream = require('event-stream');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

const utility = require('./utility.js');

const $ = require('gulp-load-plugins')({ lazy: true, camelize: true });

gulp.task('removeFrontendScriptDir', function() {
    let scriptDir = './public/js';
    utility.log(`remove frontend script folder: ${$.util.colors.blue(scriptDir)}`);
    return del.sync([scriptDir], { force: true });
});

gulp.task('lintFrontendFiles', function() {
    utility.log('frontend code evaluation with Eslint and JSCS');
    let frontendScriptList = [
        './*.js',
        './gulpTask/**/*.js',
        './src/frontend/**/*.js'
    ];
    return gulp
        .src(frontendScriptList)
        .pipe($.if(yargs.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jscsStylish())
        .pipe($.jscs.reporter('fail'))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());
});

gulp.task('transpileFrontendFiles', ['removeFrontendScriptDir', 'lintFrontendFiles'], function() {
    utility.log('ES6 code transpile, bundling and uglify...');
    let entryPointList = ['./src/frontend/js/index.js'];
    let destDir = './public/js';
    let taskList = entryPointList.map(function(entryPoint) {
        return browserify(entryPoint, { debug: true })
            .transform(babelify, { presets: ['es2015'], sourceMaps: true })
            .bundle()
            .on('error', function(error) { console.error(error); })
            .pipe(source(entryPoint.slice(18)))
            .pipe($.rename({ extname: '.bundle.js' }))
            .pipe(buffer())
            .pipe($.sourcemaps.init({ loadMaps: true }))
            .pipe($.uglify({ mangle: false, compress: { sequences: false } }))
            .pipe($.sourcemaps.write('./', { sourceRoot: './src/frontend' }))
            .pipe(gulp.dest(destDir))
            .pipe(browsersync.stream());
    });
    return eventStream.merge.apply(null, taskList);
});

gulp.task('removeStyleDir', function() {
    let styleFileDir = './public/css';
    utility.log(`remove frontend script folder: ${$.util.colors.blue(styleFileDir)}`);
    return del.sync([styleFileDir], { force: true });
});

gulp.task('compileStylingFiles', ['removeStyleDir'], function() {
    utility.log('processing SASS files');
    let scssSourceDir = './src/frontend/css/*.scss';
    let scssStream = gulp.src(scssSourceDir)
        .pipe($.sass())
        .pipe($.concat('mergedScss.scss'));

    utility.log('processing static CSS files');
    let cssSourceDir = './src/frontend/css/*.css';
    let cssStream = gulp.src(cssSourceDir)
        .pipe($.concat('mergedCss.css'));

    let destDir = './public/css';
    let mergedStream = merge(scssStream, cssStream)
        .pipe($.concat('style.css'))
        .pipe($.minifyCss())
        .pipe(gulp.dest(destDir));

    return mergedStream
        .pipe(browsersync.stream());
});

gulp.task('removeComponentDir', function() {
    let componentDir = './public/component';
    utility.log(`remove frontend files at: ${$.util.colors.blue(componentDir)}`);
    return del.sync([componentDir], { force: true });
});

gulp.task('removeTemplateDir', function() {
    let templateDir = './public/template';
    utility.log(`remove frontend files at: ${$.util.colors.blue(templateDir)}`);
    return del.sync([templateDir], { force: true });
});

gulp.task('removeViewDir', function() {
    let viewDir = './public/view';
    utility.log(`remove frontend files at: ${$.util.colors.blue(viewDir)}`);
    return del.sync([viewDir], { force: true });
});

gulp.task('removeHtmlFiles', function() {
    let htmlFilePath = './public/**/*.html';
    utility.log(`remove frontend files at: ${$.util.colors.blue(htmlFilePath)}`);
    return del.sync([htmlFilePath], { force: true });
});

gulp.task('removeFavicon', function() {
    let faviconPath = './public/**/*.html';
    utility.log(`remove favicon at: ${$.util.colors.blue(faviconPath)}`);
    return del.sync([faviconPath], { force: true });
});

gulp.task('buildFrontendStaticFiles', [
    'removeComponentDir',
    'removeTemplateDir',
    'removeViewDir',
    'removeHtmlFiles',
    'removeFavicon'
], function() {
    utility.log('process vue components');
    let vueSourceDir = './src/frontend/**/*.vue';
    let vueDestDir = './public';
    let vueStream = gulp
        .src(vueSourceDir)
        .pipe(gulp.dest(vueDestDir));

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

    return merge(vueStream, hbsStream, faviconStream, htmlStream)
        .pipe(browsersync.stream());
});
