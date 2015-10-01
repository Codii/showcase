var gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  jscs = require('gulp-jscs');

gulp.task('default', function() {
  console.log('Now, start writing gulp configuration.');
});

gulp.task('serve', function() {
  console.log("Will launch the server");
});

gulp.task('test', function() {
  return gulp.src('api/test/**/*.spec.js')
    .pipe(mocha({
      reporter : 'nyan',
      require  : ['./api/test/init']
    }))
    .on('error', _handleError)
    .once('end', function() {
      process.exit();
    });
});

gulp.task('qa', function() {
  gulp.src('api/**/*.js')
    .pipe(jscs())
    .pipe(jscs.reporter());
});

function _handleError(err) {
  console.log(err.toString());
  this.emit('end');
}
