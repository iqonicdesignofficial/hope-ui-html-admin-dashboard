'use strict';
// Packages
const gulp = require("gulp");
const gulpHelper = require('./helper')
const paths = gulpHelper.mergedModules()

// Main Move task
gulp.task("images-move-main", () => {
  const obj = gulpHelper.find(paths, 'default')
  return gulpHelper.moveImages(obj.images, obj.dir)
})

// Appointment js move task
gulp.task('images-move-landing-pages', () => {
  const obj = gulpHelper.find(paths, 'landing-pages')
  return gulpHelper.moveImages(obj.images, obj.dir)
})


// function for move images task array based on module is generate or not
function imagesTask() {
  const task = ['images-move-main']
  for (let index = 0; index < paths.length; index++) {
      const object = paths[index];
      if(object.generate) {
          task.push(`images-move-${object.name}`)
      }
  }
  return task
}

// Images main task
gulp.task("image-move", gulp.series(imagesTask()));
