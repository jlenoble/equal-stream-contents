import streamToPromise from 'stream-to-promise';
import cached from 'gulp-cached';
import {expect} from 'chai';
import {error} from 'explanation';

let counter = 0;

export default function equalStreamContents (stream1, stream2) {
  const cacheName = '__CACHE_ESC' + (counter++) + '_';
  const cacheName1 = cacheName + 1;
  const cacheName2 = cacheName + 2;

  const clearCaches = () => {
    if (cached.caches[cacheName1]) {
      delete cached.caches[cacheName1];
    }
    if (cached.caches[cacheName2]) {
      delete cached.caches[cacheName2];
    }
  };

  const cacheNames = Object.keys(cached.caches);
  const nCaches = cacheNames.length;

  if (cached.caches[cacheName1] || cached.caches[cacheName2]) {
    error({
      message: 'Caches already exist',
      explain: [
        ['Caches are one or both of:', [cacheName1, cacheName2]],
        'You probably run concurrently different versions',
        'of equalStreamContents',
      ],
    });
  }

  if (nCaches > 30 && !equalStreamContents.noCacheLimit) {
    error({
      message: 'Too many gulp-cached caches',
      explain: [
        ['Number of current caches:', nCaches],
        ['Names:', cacheNames],
        ['If you are fine with that, add in your code:',
          'equalStreamContents.noCacheLimit = true'],
        'You may also want to check this package is properly deduped',
      ],
    });
  }

  const clearCachesAndThrow = err => {
    clearCaches();
    throw err;
  };

  const p1 = streamToPromise(stream1.pipe(cached(cacheName1)))
    .then(() => cached.caches[cacheName1], clearCachesAndThrow);
  const p2 = streamToPromise(stream2.pipe(cached(cacheName2)))
    .then(() => cached.caches[cacheName2], clearCachesAndThrow);


  return Promise.all([p1, p2])
    .then(caches => {
      try {
        expect(caches[0]).to.eql(caches[1]);
        clearCaches();
      } catch (e) {
        clearCachesAndThrow(e);
      }
    });
};
