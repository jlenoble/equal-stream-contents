'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = equalStreamContents;

var _streamToPromise = require('stream-to-promise');

var _streamToPromise2 = _interopRequireDefault(_streamToPromise);

var _gulpCached = require('gulp-cached');

var _gulpCached2 = _interopRequireDefault(_gulpCached);

var _chai = require('chai');

var _explanation = require('explanation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var counter = 0;

function equalStreamContents(stream1, stream2) {
  var cacheName = '__CACHE_ESC' + counter++ + '_';
  var cacheName1 = cacheName + 1;
  var cacheName2 = cacheName + 2;

  var clearCaches = function clearCaches() {
    if (_gulpCached2.default.caches[cacheName1]) {
      delete _gulpCached2.default.caches[cacheName1];
    }
    if (_gulpCached2.default.caches[cacheName2]) {
      delete _gulpCached2.default.caches[cacheName2];
    }
  };

  var cacheNames = Object.keys(_gulpCached2.default.caches);
  var nCaches = cacheNames.length;

  if (_gulpCached2.default.caches[cacheName1] || _gulpCached2.default.caches[cacheName2]) {
    (0, _explanation.error)({
      message: 'Caches already exist',
      explain: [['Caches are one or both of:', [cacheName1, cacheName2]], 'You probably run concurrently different versions', 'of equalStreamContents']
    });
  }

  if (nCaches > 30 && !equalStreamContents.noCacheLimit) {
    (0, _explanation.error)({
      message: 'Too many gulp-cached caches',
      explain: [['Number of current caches:', nCaches], ['Names:', cacheNames], ['If you are fine with that, add in your code:', 'equalStreamContents.noCacheLimit = true'], 'You may also want to check this package is properly deduped']
    });
  }

  var clearCachesAndThrow = function clearCachesAndThrow(err) {
    clearCaches();
    throw err;
  };

  var p1 = (0, _streamToPromise2.default)(stream1.pipe((0, _gulpCached2.default)(cacheName1))).then(function () {
    return _gulpCached2.default.caches[cacheName1];
  }, clearCachesAndThrow);
  var p2 = (0, _streamToPromise2.default)(stream2.pipe((0, _gulpCached2.default)(cacheName2))).then(function () {
    return _gulpCached2.default.caches[cacheName2];
  }, clearCachesAndThrow);

  return Promise.all([p1, p2]).then(function (caches) {
    try {
      (0, _chai.expect)(caches[0]).to.eql(caches[1]);
      clearCaches();
    } catch (e) {
      clearCachesAndThrow(e);
    }
  });
};
module.exports = exports['default'];