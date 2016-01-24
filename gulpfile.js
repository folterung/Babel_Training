var gulp = require('gulp');
var babel = require('gulp-babel');
var sass = require('gulp-sass');

gulp.task('default', ['babel', 'sass', 'move'], function() {
  gulp.watch('src/**/*.js', ['babel']);
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['move']);
});

gulp.task('babel', function() {
  gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015'],
      plugins: [
        'transform-class-properties',
        'transform-es2015-modules-amd'
      ]
    }))
    .on('error', onError)
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', function() {
  gulp.src('src/app.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .on('error', onError)
    .pipe(gulp.dest('dist'));
});

gulp.task('move', function() {
  gulp.src('src/**/*.html')
    .on('error', onError)
    .pipe(gulp.dest('dist'));
});

function onError(e) {
  console.log(e.message);
}