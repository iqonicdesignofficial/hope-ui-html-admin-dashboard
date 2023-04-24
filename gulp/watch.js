module.exports = function (browserSync) {
    const gulp = require('gulp')
    const config = require('../gulp.config.json')
    const {argv} = require('yargs')

    gulp.task('watch', gulp.series(
        'clean',
        'style',
        'html-to-hbs',
        'vendor',
        'js',
        'font',
        'image-move',
        function () {
            let directory = argv.output
            if (directory === undefined) {
                directory = config.output
            }
            browserSync.init({
                server: {
                    baseDir: `./${directory}`,
                    index: "index.html"
                },
                reloadDelay: 1500
            });

            // gulp.watch('./src/**/*.scss', gulp.series('style:main'));
            // gulp.watch('./src/**/*.js', gulp.series('js-move')).on('change', browserSync.reload);
            // gulp.watch('./src/**/*.hbs', gulp.series('html-hbs')).on('change', browserSync.reload);

             // Main Tasl Task

             gulp.watch('./src/templates/components/**/*.hbs', gulp.series('html-to-hbs')).on('change', browserSync.reload);

             // Hbs Task
             gulp.watch('./src/templates/layouts/**/*.hbs', gulp.series('hbs')).on('change', browserSync.reload);
             gulp.watch('./src/templates/pages/**/*.hbs', gulp.series('hbs')).on('change', browserSync.reload);
             // Scss
             gulp.watch('./src/assets/scss/**/*.scss', gulp.series('style:main'));
             // JS
             gulp.watch('./src/assets/js/**/*.js', gulp.series('js:move-main')).on('change', browserSync.reload);


             //landing-pages
             gulp.watch('./src/templates/modules/landing-pages/**/*.hbs', gulp.series('hbs:landing-pages')).on('change', browserSync.reload);
             // Scss
             gulp.watch('./src/assets/modules/landing-pages/scss/**/*.scss', gulp.series('style:landing-pages'));
             // JS
             gulp.watch('./src/assets/modules/landing-pages/js/**/*.js', gulp.series('js:move-landing-pages')).on('change', browserSync.reload);
        }
    ));

}