'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = equalStreamContents;

var _gulpCached = require('gulp-cached');

var _gulpCached2 = _interopRequireDefault(_gulpCached);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function equalStreamContents(stream1, stream2) {
  var cacheName = '__CACHE_' + new Date().getTime() + '_';
  var cacheName1 = cacheName + 1;
  var cacheName2 = cacheName + 2;

  var p1 = new Promise(function (resolve, reject) {
    stream1.pipe((0, _gulpCached2.default)(cacheName1)).on('finish', function () {
      resolve(_gulpCached2.default.caches[cacheName1]);
    }).on('error', reject);
  });

  var p2 = new Promise(function (resolve, reject) {
    stream2.pipe((0, _gulpCached2.default)(cacheName2)).on('finish', function () {
      resolve(_gulpCached2.default.caches[cacheName2]);
    }).on('error', reject);
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