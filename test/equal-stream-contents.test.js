import gulp from 'gulp';
import {expect} from 'chai';
import equalStreamContents from '../src/equal-stream-contents';

describe('Testing equalStreamContents', function() {

  it(`equalStreamContents returns a promise that resolves on equality`,
    function() {
      return equalStreamContents(gulp.src('gulp/**/*.js'),
        gulp.src('gulp/**/*.js'));
    });

  it(`equalStreamContents returns a promise that rejects on inequality`,
    function() {
      return equalStreamContents(gulp.src('gulp/**/*.js'),
        gulp.src(['gulp/**/*.js', '!gulp/globs.js'])).catch(err => {
          expect(err.toString()).to.match(/AssertionError: expected \{ Object.* to deeply equal \{ Object/);
        });
    });

});
