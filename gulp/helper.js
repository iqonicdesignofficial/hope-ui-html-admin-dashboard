'use strict';
// Packages
const gulp = require('gulp')
const concat = require('gulp-concat')
const config = require('../gulp.config.json')
const {argv} = require('yargs')


// HBS To Html Packages
const packageDetail = require('../package.json');
const gulpHandlebars = require('gulp-compile-handlebars')
const rename = require('gulp-rename')
const hbsLayouts = require('handlebars-layouts')
const handlebars = require('handlebars')
hbsLayouts.register(handlebars)

// Js Build Packages
const terser = require('terser');
const gulpTerser = require('gulp-terser');
const wait = require('gulp-wait')

// Scss & Css Packages
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps')
const gulpRename = require("gulp-rename")

// Images task Packages
const imagemin = require("gulp-imagemin");
const gulpIf = require("gulp-if");

let dev = argv.dev
let directory = argv.output

if (directory === undefined) {
    directory = config.output
}

const AUTOPREFIXER_BROWSERS = [
  "ie >= 10",
  "ie_mob >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 7",
  "opera >= 23",
  "ios >= 7",
  "android >= 4.4",
  "bb >= 10",
  "last 30 versions",
];

// array find function
module.exports.find = function (array, name) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].name === name) {
        return array[i]
    }
  }
}

module.exports.directory = directory


// generate hbs to html function
module.exports.generateHtml = function(paths, directory) {
    return gulp.src(paths).pipe(gulpHandlebars({ // custom variables
        layout: config.layout,
        dev: dev,
        version: packageDetail.version,
        appName: config.appName,
        dark: config.dark,
      },{ // options
		ignorePartials: true,
        batch: ['./src/templates/']
    })
  ).pipe(rename({extname: ".html",})
  ).pipe(gulp.dest(`./${directory}`));
}

// generate scss to css function
module.exports.generateScssDev = function(paths, directory, browserSync) {
    return gulp.src(paths)
    .pipe(sourcemaps.init())
    .pipe(
      sass.sync({
        includePaths: ["./node_modules"],
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulpRename({extname: ".min.css",}))
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest(`./${directory}/assets/css/`))
    .pipe(browserSync.stream());
}

module.exports.generateScss = function(paths, directory) {
  return gulp.src(paths)
  .pipe(
    sass({
      includePaths: ["./node_modules"],
    }).on("error", sass.logError)
  )
  .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
  .pipe(gulp.dest(`./${directory}/assets/css/`));
}

// css build function take library
module.exports.cssBuild = function (paths, directory) {
  return gulp.src(paths).pipe(
    sass.sync({
      includePaths: ["./node_modules"],
      outputStyle: "compressed",
    }).on("error", sass.logError)
  )
  .pipe(cleanCSS())
  .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
  .pipe(concat("libs.min.css"))
  .pipe(gulp.dest(`./${directory}/assets/css/core`))
}

// move js to assets function
module.exports.moveJs = function(paths, directory) {
  return gulp.src(paths).pipe(gulp.dest(`./${directory}/assets/js`));
}

// build js to assets function
module.exports.jsBuild = function(paths, directory, filename) {
  return gulp.src(paths)
    .pipe(wait(500))
    .pipe(concat(filename))
    .pipe(gulpTerser({}, terser.minify))
    .pipe(gulp.dest(`./${directory}/assets/js/core`));
}

// Uglifi & minify javascript
module.exports.uglify = function(paths, directory) {
  return gulp.src(paths)
    .pipe(gulpTerser({}, terser.minify))
    .pipe(rename({extname: ".min.js",}))
    .pipe(gulp.dest(`./${directory}/assets/js/iqonic-script`));
}

// move images to assets function
module.exports.moveImages = function(paths, directory) {
  let mini = argv.mini
  if (mini === undefined) {
    mini = config.mini
  }

  return gulp.src(paths)
    .pipe(gulpIf(mini == "true", imagemin()))
    .pipe(gulp.dest(`./${directory}/assets/images`));
}

const defaultPaths = [
  {
    name: 'default',
    dir: directory,
    pages: [ 'src/templates/pages/**/*.hbs' ],
    scss: ['./src/assets/scss/**/*.scss'],
    js: ['./src/assets/js/**/*.js'],
    images: ['./src/assets/images/**/*.*'],
  },
  {
    name: 'landing-pages',
    dir: `${directory}/landing-pages`,
    pages: ['src/templates/modules/landing-pages/pages/**/*.hbs'],
    scss: ['src/assets/modules/landing-pages/scss/**/*.scss'],
    js: ['src/assets/modules/landing-pages/js/**/*.*'],
    images: ['src/assets/modules/landing-pages/images/**/*.*'],
    generate: true
  },
]

// default paths object export
module.exports.modulesOptions = defaultPaths


// default object merge with gulp.config.json object
module.exports.mergedModules = function () {
  const configModule = config.modules
  const mergedPath = defaultPaths.map(function (item) {
    const newobj = configModule.find((cm) => cm.name === item.name)
    return {...item, ...newobj}
  })
  return mergedPath
}