# equal-stream-contents
Compare two streams on the fly (no writing on disc)

## Usage

When testing streams, you may want to check their contents against other streams instead of against files on disc (which is what module [gulp-diff](https://www.npmjs.com/package/gulp-diff) does for example).

Leveraging module [gulp-cached](https://www.npmjs.com/package/gulp-cached), function ```equalStreamContents``` allows for such a comparison on the fly.

Note that function ```equalStreamContents``` is not a [Gulp](http://gulpjs.com/) plugin.

```js
import gulp from 'gulp';
import equalStreamContents from 'equal-stream-contents';

const stream1 = gulp.src('dir1/**/*.js');
const stream2 = gulp.src('dir1/*.js');

equalStreamContents(stream1, stream2).then(() => {
  // Equality branch
}, err => {
  // Inequality branch
});
```

## License

equal-stream-contents is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
