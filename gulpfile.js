'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const htmlBeautify = require('gulp-html-beautify');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const del = require('del');
const imageMin = require('gulp-imagemin');
const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const stripCssComments = require('gulp-strip-css-comments');

const path = {
    dist: {
        html: './dist',
        styles: {
            scss: './dist',
            css: './dist',
        },
        js: './dist',
        img: './dist/img',
        upload: './dist/uploads',
        fonts: './dist/fonts',
    },
    src: {
        html: './src/html/views/**/*.pug',
        styles: {
            scss: './src/styles/main.scss',
            css: './src/styles/vendor.css',
        },
        js: {
            custom: './src/js/**/main.js',
            vendor: './src/js/**/vendor.js'
        },
        img: './src/img/**/*.{png,gif,jpg,svg}',
        upload: './src/uploads/**/*.*',
        fonts: './src/fonts/**/*.*',

    },
    watch: {
        html: './src/html/**/*.pug',
        styles: {
            scss: './src/styles/**/*.scss',
            css: './src/styles/**/*.css',
        },
        js: './src/js/**/*.js',
        img: './src/img/**/*.{png,gif,jpg,svg}',
        upload: './src/uploads/**/*.*',
        fonts: './src/fonts/**/*.*',

    },
    clean: './dist',
    browserSyncWatch: 'dist/**/*.*',
};

// local server
gulp.task('serve', function () {
    browserSync.init({
        server: 'dist',
    });

    browserSync.watch(path.browserSyncWatch).on('change', browserSync.reload);
});

gulp.task('html', function () {
    return gulp.src(path.src.html)
        .pipe(pug())
        .pipe(htmlBeautify())
        .pipe(gulp.dest(path.dist.html));
});

// требуется удалять комментарии при сборке min.css
gulp.task('scss', function () {
    return gulp.src(path.src.styles.scss)
        .pipe(sass({
            outputStyle: 'expanded',
            indentWidth: 4,
        }))
        .pipe(autoprefixer({
            browsers: ['last 8 versions', '> 1%', 'not dead', 'not ie < 11'],
            cascade: true,
        }))
        .pipe(gulp.dest(path.dist.styles.scss));
});

gulp.task('css', function () {
    return gulp.src(path.src.styles.css)
        .pipe(rigger())
        .pipe(gulp.dest(path.dist.styles.css));
});

gulp.task('styles', gulp.series(gulp.parallel('scss', 'css')));

gulp.task('js:custom', function () {
    return gulp.src(path.src.js.custom)
        .pipe(rigger())
        .pipe(stripCssComments())
        .pipe(gulp.dest(path.dist.js));
});

gulp.task('js:vendor', function () {
    return gulp.src(path.src.js.vendor)
        .pipe(rigger())
        .pipe(gulp.dest(path.dist.js))
        .pipe(uglify())
        .pipe(stripCssComments()) // точно ли удаляет комменты
        .pipe(gulp.dest(path.dist.js));
});

gulp.task('js', gulp.series(gulp.parallel('js:custom', 'js:vendor')));

gulp.task('img', function () {
    return gulp.src(path.src.img)
        .pipe(imageMin({
            optimizationLevel: 4,
            progressive: true,
            svgPlugins: [{
                removeViewBox: false
            }],
            interlaced: true,
        }))
        .pipe(gulp.dest(path.dist.img));
});

gulp.task('fonts', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts));
});

gulp.task('uploads', function () {
    return gulp.src(path.src.upload)
        .pipe(gulp.dest(path.dist.upload));
});

gulp.task('watch', function () {
    gulp.watch(path.watch.styles.css, gulp.series('css'));
    gulp.watch(path.watch.styles.scss, gulp.series('scss'));
    gulp.watch(path.watch.html, gulp.series('html'));
    gulp.watch(path.watch.js, gulp.series('js'));
    gulp.watch(path.watch.img, gulp.series('img'));
    gulp.watch(path.watch.img, gulp.series('fonts'));
    gulp.watch(path.watch.img, gulp.series('uploads'));
});

gulp.task('clean', function () {
    return del(path.clean);
});

gulp.task('build',
    gulp.series('clean',
        gulp.parallel('html', 'styles', 'fonts', 'uploads', 'img', 'js')));

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));