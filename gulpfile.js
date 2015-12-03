var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');

// Static Server + watching scss/html files
gulp.task('serve', function() {

    browserSync.init({
        server: "./public"
    });

    gulp.watch(["public/**/*.html", "public/js/**/*.js"]).on('change', browserSync.reload);
    gulp.watch(["public/css/**/*.css"], ['css']);
});

gulp.task('css', function() {
    return gulp.src("public/css/*.css")
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(browserSync.stream());
});

gulp.task('autoprefix', function() {
    return gulp.src("public/css/*.css")
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('public/css/'));
});

gulp.task('default', ['serve']);