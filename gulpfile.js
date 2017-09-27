var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var run = require('run-sequence');
var del = require('del');

gulp.task('sprite', function() {
	return gulp.src('app/img/sprite/i-*.png')
	.pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: 'sprite.css',
		padding: 2
	}))
	.pipe(gulp.dest('app/img'))
});

gulp.task('style', function() {
	gulp.src('app/css/style.css')
	.pipe(postcss([
		autoprefixer({browsers: ['last 1 version', 
								 'last 2 Chrome versions',
								 'last 2 Firefox versions', 
								 'last 2 Opera versions',
								 'last 2 Edge versions',
								]}),
		mqpacker({
			sort: true
		})
		]))
	.pipe(csso())
	.pipe(gulp.dest('dist/css'))

});

gulp.task('images', function() {
	return gulp.src('dist/img/*.+(png|jpg|gif)')
	.pipe(imagemin([
		imagemin.optipng({optimizationLevel: 3}),
		imagemin.jpegtran({progressive: true})
		]))
	.pipe(gulp.dest('dist/img'))
});

gulp.task('build', function(fn) {
	run('del', 'copy', 'style', 'images', fn);
});

gulp.task('copy', function() {
	return gulp.src([
		'app/fonts/**',
		'app/img/*.+(png|jpg|gif)',
		'app/js/**',
		'app/*.html',
		'app/css/*.css'
		], {
			base: 'app'
		})
	.pipe(gulp.dest('dist'));
});

gulp.task('del', function() {
	return del('dist');
});