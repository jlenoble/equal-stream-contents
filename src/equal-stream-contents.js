import streamToPromise from 'stream-to-promise';
import cached from 'gulp-cached';
import {expect} from 'chai';

export default function equalStreamContents(stream1, stream2) {
  const cacheName = '__CACHE_' + (new Date()).getTime() + '_';
  const cacheName1 = cacheName + 1;
  const cacheName2 = cacheName + 2;

  var p1 = streamToPromise(stream1.pipe(cached(cacheName1)))
    .then(() => cached.caches[cacheName1]);
  var p2 = streamToPromise(stream2.pipe(cached(cacheName2)))
    .then(() => cached.caches[cacheName2]);

  return Promise.all([p1, p2])
    .then(caches => {
      try {
        expect(caches[0]).to.eql(caches[1]);
        delete cached.caches[cacheName1];
        delete cached.caches[cacheName2];
      } catch (e) {
        delete cached.caches[cacheName1];
        delete cached.caches[cacheName2];
        throw e;
      }
    });
};
