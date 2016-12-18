var gulp = require('gulp');
var typescript = require('gulp-typescript');

//デフォルト
gulp.task('default', function () {
  return gulp.src(['./src/*.ts','./typings/*.ts','!./node_modules/**/*.ts'])
    .pipe(typescript('./tsconfig.json')).js
    .pipe(gulp.dest('./docs/js/'));
});

//ローカルサーバ起動
var webserver = require('gulp-webserver');
gulp.task('localserver', function() {
  gulp.src('./docs/').pipe(webserver());
});