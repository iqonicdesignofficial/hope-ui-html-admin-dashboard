"use strict";
// Packages
const gulp = require('gulp')
const config = require('../gulp.config.json')
const gulpHelper = require('./helper')
const paths = gulpHelper.mergedModules()

// Main js move task
gulp.task('js:move-main', () => {
    const obj = gulpHelper.find(paths, 'default')
    return gulpHelper.moveJs(obj.js, obj.dir)
})

// landing-pages js move task
gulp.task('js:move-landing-pages', () => {
    const obj = gulpHelper.find(paths, 'landing-pages')
    return gulpHelper.moveJs(obj.js, obj.dir)
})

// function for generate js move task array based on module is generate or not
function jsMoveTask() {
    const task = ['js:move-main']
    for (let index = 0; index < paths.length; index++) {
        const object = paths[index];
        if(object.generate) {
            task.push(`js:move-${object.name}`)
        }
    }
    return task
}

// Iqonic js move task
gulp.task('js:move-iqonic', () => {
  const obj = gulpHelper.find(paths, 'default')
  return gulpHelper.uglify(['src/assets/js/iqonic-script/*.js'], obj.dir)
})

// Main js move task
gulp.task('js:move', gulp.series(jsMoveTask(), 'js:move-iqonic'));

// Build core library js task
gulp.task('js:libs-mini', function() {
    const scripts = config.assets.js.core
    const obj = gulpHelper.find(paths, 'default')
    if (scripts.length) {
        return gulpHelper.jsBuild(scripts, obj.dir, 'libs.min.js')
    } else {
        return true
    }
})

// Build external js task
gulp.task('js:external-libs-mini', function() {
    const scripts = config.assets.js.external
    const obj = gulpHelper.find(paths, 'default')
    if (scripts.length) {
        return gulpHelper.jsBuild(scripts, obj.dir, 'external.min.js')
    } else {
        return true
    }
})

// Main js task & build core, external task
gulp.task('js', gulp.series('js:move','js:libs-mini','js:external-libs-mini'))
