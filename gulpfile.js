var gulp        = require('gulp'),
    ts          = require('gulp-typescript'),
    merge       = require('merge-stream'),
    sourcemaps  = require('gulp-sourcemaps'),
    git         = require('gulp-git'),
    bump        = require('gulp-bump'),
    tag_version = require('gulp-tag-version'),
    filter      = require('gulp-filter'),
    mocha       = require('gulp-mocha'),
    del         = require('del'),
    runSequence = require('run-sequence'),
    tsd         = require('gulp-tsd');
 
var PATHS = {
  src: 'lib',
  build: 'build',
  test: 'test',
  typings: 'typings'
};
 
var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });
 
/**
 * Dev tasks
 */
gulp.task('tsd', function (callback) {
  tsd({
    command: 'reinstall',
    config: './tsd.json'
  }, callback);
});

gulp.task('clean:tsd', function (cb) {
  del([
    PATHS.typings
  ], cb);
});


gulp.task('scripts:dev', function() {
  var tsResult = gulp.src([
      PATHS.src + '/**/*.ts',
      PATHS.test + '/**/*.ts'
    ], { base: "./" })
      .pipe(sourcemaps.init())
      .pipe(ts(tsProject));
   
  return merge([
    tsResult.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('.'))
  ]);
});

gulp.task('watch', ['scripts:dev'], function() {
    gulp.watch(PATHS.src + '/**/*.ts', ['scripts']);
});

gulp.task('clean:dev', function (cb) {
  del([
    PATHS.src + '/**/*.js',
    PATHS.test + '/**/*.js'
  ], cb);
});

/**
 * Tests tasks
 */
gulp.task('test', ['scripts:dev'], function () {
  return gulp.src(PATHS.test + '/**/*.js', {read: false})
    .pipe(mocha({
      reporter: 'spec'
    }));
});

/**
 * Prod
 */
gulp.task('scripts:prod', function() {
  var tsResult = gulp.src([
      PATHS.src + '/**/*.ts'
    ])
      .pipe(sourcemaps.init())
      .pipe(ts(tsProject));
   
  return merge([
    tsResult.dts.pipe(gulp.dest(PATHS.build + '/definitions')),
    tsResult.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(PATHS.build + '/js'))
  ]);
}); 

gulp.task('clean:prod', function (cb) {
  del([
    PATHS.build
  ], cb);
});

/**
 * Cleaning
 */
gulp.task('clean', ['clean:dev', 'clean:prod', 'clean:tsd']);

/**
 * Default
 */

gulp.task('default', function (cb) {
  runSequence(
    'clean',
    'tsd',
    'test',
    'scripts:prod'
  );
});

/**
 * CI
 */
gulp.task('ci', function (cb) {
  runSequence(
    'clean',
    'tsd',
    'test'
  );
});

/**
 * Bumping version
 */
function inc(importance) {
  return gulp.src(['./package.json'])
    .pipe(bump({type: importance}))
    .pipe(gulp.dest('./'))
    .pipe(git.commit('Bumps for new ' + importance + ' release.'))
    .pipe(filter('package.json'))
    .pipe(tag_version());
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });