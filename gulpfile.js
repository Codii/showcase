var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  jscs = require('gulp-jscs'),
  istanbul = require('gulp-istanbul');

gulp.task('default', function() {
  console.log('Now, start writing gulp configuration.');
});

gulp.task('serve', function() {
  console.log('Will launch the server');
});

gulp.task('test', ['coverage'], function() {
  return gulp.src('api/test/**/*.spec.js')
    .pipe(mocha({
      reporter : 'nyan',
      require  : ['./api/test/init']
    }))
    .pipe(istanbul.writeReports())
    .on('error', _handleError)
    .once('end', function() {
      process.exit();
    });
});

gulp.task('qa', function() {
  return gulp.src([
    'api/**/*.js',
    '!api/coverage/**/*.js'
  ])
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('coverage', function() {
  return gulp.src([
    'api/**/*.js'
  ])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

function _handleError(err) {
  console.log(err.toString());
  this.emit('end');
}
