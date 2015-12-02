var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

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
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);