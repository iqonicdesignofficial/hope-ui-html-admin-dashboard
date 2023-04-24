'use strict';
module.exports = function (browserSync) {
  // Packages
  const gulp = require('gulp')
  const {argv} = require('yargs')
  const config = require('../gulp.config.json')
  const gulpHelper = require('./helper')

  // const paths = gulpHelper.modulesOptions

  const paths = gulpHelper.mergedModules()


  let dev = argv.dev

  function scsstask(obj) {
    return gulpHelper.generateScss(obj.scss, obj.dir)
  }

  function scsstaskDev(obj) {
    return gulpHelper.generateScssDev(obj.scss, obj.dir, browserSync);
  }

  gulp.task('style:main', function () {
    const obj = gulpHelper.find(paths, 'default')
      if (dev == 'true') {
        return scsstaskDev(obj)
      } else { 
        scsstaskDev(obj)
        return scsstask(obj)
      }
  })

  gulp.task('style:landing-pages', function () {
    const obj = gulpHelper.find(paths, 'landing-pages')
      if (dev == 'true') {
        return scsstaskDev(obj)
      } else { 
        scsstaskDev(obj)
        return scsstask(obj)
      }
  })


  // function for generate js move task array based on module is generate or not
function scssTocssTask() {
  const task = ['style:main']
  for (let index = 0; index < paths.length; index++) {
      const object = paths[index];
      if(object.generate) {
          task.push(`style:${object.name}`)
      }
  }
  return task
}

  // Main js move task
  gulp.task('style:tasks', gulp.series(scssTocssTask()));

  gulp.task('style:libs', function(){
      const obj = gulpHelper.find(paths, 'default')
      return gulpHelper.cssBuild(config.assets.style, obj.dir);
  })

  gulp.task('style', gulp.series('style:libs','style:tasks'));
}