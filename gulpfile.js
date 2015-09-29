var gulp = require('gulp'),
  mocha = require('gulp-mocha');

gulp.task('default', function() {
  console.log('Now, start writing gulp configuration.');
});

gulp.task('serve', function(){
  console.log("Will launch the server");
});

gulp.task('test', function(){
  return gulp.src('api/test/**/*.spec.js')
    .pipe(mocha({
      require: ['./api/test/helpers']
    }));
});

