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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var counter = 0;

function equalStreamContents(stream1, stream2) {
  var cacheName = '__CACHE_' + counter++ + '_';
  var cacheName1 = cacheName + 1;
  var cacheName2 = cacheName + 2;

  var p1 = (0, _streamToPromise2.default)(stream1.pipe((0, _gulpCached2.default)(cacheName1))).then(function () {
    return _gulpCached2.default.caches[cacheName1];
  });
  var p2 = (0, _streamToPromise2.default)(stream2.pipe((0, _gulpCached2.default)(cacheName2))).then(function () {
    return _gulpCached2.default.caches[cacheName2];
  });

  return Promise.all([p1, p2]).then(function (caches) {
    try {
      (0, _chai.expect)(caches[0]).to.eql(caches[1]);
      delete _gulpCached2.default.caches[cacheName1];
      delete _gulpCached2.default.caches[cacheName2];
    } catch (e) {
      delete _gulpCached2.default.caches[cacheName1];
      delete _gulpCached2.default.caches[cacheName2];
      throw e;
    }
  });
};
module.exports = exports['default'];