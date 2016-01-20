var fs = require('fs')

var babelrc = fs.readFileSync('./.babelrc.node')
var config

try {
  config = JSON.parse(babelrc)
} catch (err) {
  console.error('Error parsing .babelrc.')
  console.error(err)
}

require('babel-register')(config)

var babelSource = process.env.BABEL_SOURCE

require(babelSource)
