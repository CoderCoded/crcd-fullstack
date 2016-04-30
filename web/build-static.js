global.Promise = require('bluebird')
Promise.config({
  warnings: {
    wForgottenReturn: false // This disables a warning from async/await
  }
})
const __DEVELOPMENT__ = process.env.NODE_ENV !== 'production'
const APP_DESC = require('./package.json').description

import 'babel-polyfill'
import walk from 'walk'
import path from 'path'

import CONFIG from 'config'

const options = {
  enabled: CONFIG.static.enabled,
  input: 'src/static-views',
  layouts: '_layouts',
  includes: '_includes',
  output: __DEVELOPMENT__ ? '.tmp/static' : 'build/static'
}

if (!options || !options.enabled) {
  console.log('Static not enabled, skipping static views build...')
  process.exit(0)
}

const inputPath = options.input
const outputPath = options.output

console.log('Building static views from ' + inputPath)

const walker = walk.walk(inputPath, {
  followLinks: false,
  filters: [options.layouts, options.includes]
})

const fs = Promise.promisifyAll(require('fs'))
const nunjucks = Promise.promisifyAll(require('nunjucks'))
const mkdirp = Promise.promisify(require('mkdirp'))

const nunjucksEnv = nunjucks.configure(inputPath, {
  autoescape: true
})

let assetsPath = '/dist'
if (__DEVELOPMENT__) {
  const webpackPort = process.env.WEBPACK_PORT || 3001
  const webpackHost = process.env.WEBPACK_HOST || 'localhost'
  assetsPath = 'http://' + webpackHost + ':' + webpackPort + assetsPath
}
nunjucksEnv.addGlobal('description', APP_DESC)
nunjucksEnv.addGlobal('assetsPath', assetsPath)
nunjucksEnv.addGlobal('__DEVELOPMENT__', __DEVELOPMENT__)

function fileHandler (root, fileStat, next) {
  let { name } = fileStat

  let inputFile = path.resolve(root, name)
  let outputFile = path.resolve(outputPath, root.replace(inputPath, '.'), name)

  console.log('Rendering file:')
  console.log('In: ', inputFile)
  console.log('Out:', outputFile)

  return mkdirp(outputPath)
    .then(function () {
    // await fs.readFileAsync(inputFile)
      return nunjucks.renderAsync(inputFile)
    })
    .then(function (htmlString) {
      fs.writeFileSync(outputFile, htmlString)
      next()
    })
    .catch(function (err) {
      console.error(err)
      next(err)
    })
}

function dirHandler (root, dirStat, next) {
  let { name } = dirStat

  // Skip layouts and includes
  if (name === options.layouts || name === options.includes) {
    next()
    return
  }

  console.log('Found dir:', root + '/' + name)

  let outputDir = path.resolve(outputPath, root.replace(inputPath, '.'), name)

  return mkdirp(outputDir)
    .then(function () {
      next()
    })
    .catch(function (err) {
      console.error(err)
      next(err)
    })
}

function errorsHandler (root, nodeStatsArray, next) {
  nodeStatsArray.forEach((n) => {
    console.error('[ERROR] ' + n.name)
    console.error(n.error.message || (n.error.code + ': ' + n.error.path))
  })
  next()
}

function endHandler () {
  console.log('Static build done.')
  process.exit(0)
}

walker.on('file', fileHandler)
walker.on('directory', dirHandler)
walker.on('errors', errorsHandler)
walker.on('end', endHandler)
