const gulp = require('gulp')

gulp.task('build', gulp.series([
    'clean',
    'style',
    'html-to-hbs',
    'vendor',
    'js',
    'font',
    'image-move'
]))
