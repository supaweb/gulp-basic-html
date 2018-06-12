var gulp  = require('gulp'),
    rsync = require('gulp-rsync'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    stripDebug = require('gulp-strip-debug'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    fileinclude = require('gulp-file-include'),
    gcmq = require('gulp-group-css-media-queries'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat');


const $ = gulpLoadPlugins();
const source_dir = 'src';
const destination_dir = '../../../web/dashboard';

gulp.task('css', function() {
    return gulp.src(source_dir + '/scss/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(destination_dir + '/look/css'));
});

// Обработка скриптов
var jsFiles = [
    source_dir + '/js/main.js',
    source_dir + '/js/components/_dashboard.js',
    source_dir + '/js/components/_add_to_favorite.js'
];
gulp.task('js', function() {
    gulp.src(jsFiles)
        .pipe($.plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destination_dir + '/look/js'));

    return gulp.src(source_dir + '/js-direct/**/*')
        .pipe(gulp.dest(destination_dir + '/look/js'));
});

gulp.task('img', function() {
    return gulp.src(source_dir + '/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{cleanupIDs: false}]
        })))
        .pipe(gulp.dest(destination_dir + '/look/img'));
});

gulp.task('svg', function() {
    return gulp.src(source_dir + '/svg/**/*.svg')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{cleanupIDs: true}]
        })))
        .pipe(gulp.dest(destination_dir + '/look/svg'));
});

gulp.task('img:clean', () => {
    return del(destination_dir + '/look/img', {force: true});
});

gulp.task('html', () => {
    return gulp.src(source_dir + '/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: source_dir + '/html'
        }))
        .pipe(gulp.dest(destination_dir + '/'));
});

gulp.task('watch', function() {
    gulp.watch(source_dir + '/scss/**/*.scss', ['css']);
    gulp.watch(source_dir + '/js/**/*.js', ['js']);
    gulp.watch(source_dir + '/images/**/*', ['img']);
    gulp.watch(source_dir + '/svg/**/*.svg', ['svg']);
    // gulp.watch(source_dir + '/**/*.html', ['html']);
});

gulp.task('compress-css', function(){
    return gulp.src(destination_dir + '/look/css/**/*.css', {base: './'})
        .pipe(gcmq())
        .pipe(cssnano())
        .pipe(gulp.dest('./'));
});

gulp.task('compress-js', function(){
    return gulp.src(destination_dir + '/look/js/**/*.js', {base: './'})
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('build', ['compress-css', 'compress-js']);




    
  