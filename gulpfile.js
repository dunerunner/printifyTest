'use strict';

const {src, dest, parallel, series, watch} = require('gulp');
const webserver = require('gulp-webserver');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const livereload = require('gulp-livereload');

const babelify = require('babelify');
const browserify = require('browserify');
const hbsfy = require('hbsfy');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');


function html() {
    return src('./src/*.html')
        .pipe(dest('./dist/'))
        .pipe(livereload());
}

function compileSass() {
    return src('./src/scss/main.scss')
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(rename('bundle.css'))
        .pipe(dest('./dist/css'))
        .pipe(livereload());
}


function copyFavicon() {
    return src('./favicon.ico')
        .pipe(dest('./dist'));
}

function copyJson() {
    return src('./data/*.json')
        .pipe(dest('./dist/data'));
}

function copyFonts() {
    return src('./node_modules/@fortawesome/fontawesome-free/webfonts/**')
        .pipe(dest('./dist/webfonts'));
}

function scripts() {
    return browserify({debug: true})
        .transform(hbsfy)
        .transform(babelify.configure({presets: ['@babel/env']}))
        .require('./src/js/index.js', {entry: true})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(dest('./dist/scripts'))
        .pipe(livereload());
}

function runWebserver() {
    src('./dist')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true
        }));
}


function watchFiles() {
    watch('./src/**/*.html', html);
    watch('./src/scss/*.scss', compileSass);
    watch(['./src/js/**/*.js', './src/js/**/*.hbs'], scripts);
}

exports.html = html;
exports.compileSass = compileSass;
exports.scripts = scripts;

exports.default = series(parallel(html, copyFavicon, copyJson, copyFonts, compileSass, scripts), parallel(runWebserver, watchFiles));