'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var terser = require('gulp-terser');
var concat = require('gulp-concat');
 
sass.compiler = require('node-sass');

function pluginsTask() {
	return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/popper.js/dist/umd/popper.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
			'node_modules/slick-carousel/slick/slick.js',
		])
        .pipe(concat('plugins-min.js'))
        .pipe(gulp.dest('web/assets/js')
    );
}

function scssTask() {
	var plugins = [
        autoprefixer(),
        cssnano()
    ];
	return gulp.src([
			'web/assets/css/scss/styles.scss'
		]).pipe(sass({ 
    		includePaths: ['node_modules']
    	}).on('error', sass.logError))
    	.pipe(rename('styles.css'))
    	.pipe(postcss(plugins))
    	.pipe(gulp.dest('web/assets/css')
    );
}

function jsTask() { 
	return gulp.src(['web/assets/js/onload.js'])
        .pipe(rename('onload-min.js'))
        .pipe(terser())
        .pipe(gulp.dest('web/assets/js')
    );
}

function watchTask() {
    gulp.watch(
        ['web/assets/css/scss/*.scss', 'web/assets/js/onload.js'],
        gulp.parallel(scssTask, jsTask)
    );
}

gulp.task('default',
    gulp.series(gulp.parallel(scssTask, jsTask, pluginsTask), watchTask));