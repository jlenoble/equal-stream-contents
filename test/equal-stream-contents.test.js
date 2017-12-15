import gulp from 'gulp';
import {expect} from 'chai';
import equalStreamContents from '../src/equal-stream-contents';
import {tmpDir} from 'cleanup-wrapper';
import touch from 'touch';
import mkdirp from 'mkdirp';

describe('Testing equalStreamContents', function () {
  it(`equalStreamContents returns a promise that resolves on equality`,
    function () {
      return equalStreamContents(gulp.src('gulp/**/*.js'),
        gulp.src('gulp/*.js'));
    });

  it(`equalStreamContents returns a promise that rejects on inequality`,
    function () {
      return equalStreamContents(gulp.src('gulp/**/*.js'),
        gulp.src(['gulp/**/*.js', '!gulp/globs.js'])).catch(err => {
        try {
          expect(err.toString()).to.match(/AssertionError: expected \{ Object.* to deeply equal \{ Object/);
        } catch (e) {
          throw err;
        }
      });
    });
});

describe('Testing equalStreamContents with more than 16 files', function () {
  it(`equalStreamContents returns a promise that resolves on equality`,
    tmpDir('tmp', function () {
      mkdirp.sync('tmp');
      for (let i = 0; i < 20; i++) {
        touch.sync('tmp/a' + i);
      }
      return equalStreamContents(gulp.src('tmp/*'), gulp.src('tmp/*'));
    }));

  it(`equalStreamContents returns a promise that rejects on inequality`,
    tmpDir('tmp', function () {
      mkdirp.sync('tmp');
      for (let i = 0; i < 20; i++) {
        touch.sync('tmp/a' + i);
      }
      return equalStreamContents(gulp.src('tmp/*'),
        gulp.src(['tmp/*', '!tmp/a0'])).catch(err => {
        try {
          expect(err.toString()).to.match(/AssertionError: expected \{ Object.* to deeply equal \{ Object/);
        } catch (e) {
          throw err;
        }
      });
    }));
});
