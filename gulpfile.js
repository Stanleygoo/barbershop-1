var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync');

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var csso = require('gulp-csso');

var imagemin = require('gulp-imagemin');
var svgmin = require('gulp-svgmin');
var spritesmith = require('gulp.spritesmith');

var del = require('del');
var runSequence = require('run-sequence');



gulp.task('less', function(){
	return gulp.src('less/main.less')
	.pipe(less())
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', ['browserSync', 'less'], function() {
	gulp.watch('less/**/*.less', ['less']);
	gulp.watch('*html', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function() {
	browserSync({
		server: {baseDir: '.'},
		notify: false
	});
});

gulp.task('sprite', function() {
	return gulp.src('img/sprite/*')
	.pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.css',
		padding: 2
	}))
	.pipe(gulp.dest('img'))
});

/*Optimizing for production*/
gulp.task('styleOptimization', function() {
	return gulp.src('build/css/main.css')
	.pipe(postcss([
		autoprefixer({browsers: ['last 1 version', 
								 'last 2 Chrome versions',
								 'last 2 Firefox versions', 
								 'last 2 Opera versions',
								 'last 2 Edge versions',
			]}),
		mqpacker({sort: true})]))
	.pipe(csso())
	.pipe(gulp.dest('build/css'))
})

gulp.task('imageOptimization', function() {
	return gulp.src('build/img/*.+(jpg|png|gif)')
	.pipe(imagemin([
		imagemin.optipng({optimizationLevel: 3}),
		imagemin.jpegtran({progressive: true})
		]))
	.pipe(gulp.dest('build/img'))
});

gulp.task('svgOptimization', function() {
	return gulp.src('build/img/*.svg')
	.pipe(svgmin())
	.pipe(gulp.dest('build/img'))
});

gulp.task('del', function() {
	return del('build');
})

gulp.task('copy', function() {
	return gulp.src([
		'fonts/**/',
		'img/*.+(png|jpg|gif|svg)',
		'js/**',
		'*.html',
		'css/main.css'
		], {base: '.'})
	.pipe(gulp.dest('build'));
});

gulp.task('build', function(fn) {
	runSequence('del', 'copy', 'styleOptimization', 'imageOptimization', 'svgOptimization', fn)
});

