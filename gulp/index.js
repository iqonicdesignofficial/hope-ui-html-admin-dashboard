'use strict';
// Packages
const gulp = require('gulp')
const browserSync = require('browser-sync').create();

// Import gulp tasks
require('./hbs-helpers')
require('./clean-task')
require('./html-tasks')
require('./css-tasks')(browserSync)
require('./js-tasks')
require('./fonts-task')
require('./images-tasks')
require('./vendor-tasks')
require('./watch')(browserSync)
require('./build')

// Run default task
gulp.task('default', gulp.series('watch'))