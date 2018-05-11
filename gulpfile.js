var gulp = require('gulp');
var minify = require('gulp-minify');
var replace = require('gulp-replace');
var clipboard = require("gulp-clipboard");

gulp.task('compress', function() {
  gulp.src('src/contract.js')
    .pipe(minify())
    .pipe(replace('"', '\\"'))
    .pipe(clipboard())
    .pipe(gulp.dest('dist'))

});

gulp.task('compress2', function() {
    gulp.src('src/contract.js')
      .pipe(minify({
          ext:{
              src:'-debug.js',
              min:'.js'
          },
          exclude: ['tasks'],
          ignoreFiles: ['.combo.js', '-min.js']
      }))
      .pipe(gulp.dest('dist'))
      .pipe(replace('"', '\\"'))
      .pipe(clipboard())
  
  
  });

