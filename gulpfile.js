const gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  map = require('gulp-sourcemaps'),
  del = require('del'),
  newer = require('gulp-newer'),
  webp = require('gulp-webp'),
  imagemin = require('gulp-imagemin');

const cssFiles = [
  'src/scss/styles.scss',
  'src/scss/owl.carousel.scss',
  'src/scss/owl.theme.default.scss',
];

const jsFiles = [
    'src/js/jquery-3.6.0.min.js',
    'src/js/owl.carousel.min.js',
    'src/js/main.js',
  ];

gulp.task('styles', function () {
  return gulp
    .src(cssFiles)
    .pipe(concat('styles.min.css'))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false,
      }).pipe(sass({ outputStyle: 'compressed' }))
    )
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', function () {
  return gulp.src('./*.html').pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts', function () {
  return gulp
    .src(jsFiles)
    .pipe(map.init())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', function () {
  return gulp
    .src('src/img/**/*.{jpg,jpeg,png,gif,webp}')
    .pipe(newer('build/img'))
    .pipe(webp())
    .pipe(gulp.dest('build/img'))
    .pipe(newer('build/img'))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest('build/img'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('svg', function () {
  return gulp
    .src('src/img/**/*.svg')
    .pipe(gulp.dest('build/img'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('clean', function () {
  return del(['build/*']);
});

gulp.task('watch', function () {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });

  gulp.watch('src/scss/**/*.scss', gulp.parallel('styles'));
  gulp.watch('./*.html', gulp.parallel('html'));
  gulp.watch('src/js/*.js', gulp.parallel('scripts'));
  gulp.watch(
    'src/img/**/*.{jpg,jpeg,png,gif,webp,svg}',
    gulp.parallel('images')
  );
});

gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('styles', 'scripts', 'images', 'svg'))
);

gulp.task('dev', gulp.series('build', 'watch'));
