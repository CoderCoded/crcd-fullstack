global.Promise = require('bluebird')
// const __DEVELOPMENT__ = process.env.NODE_ENV !== 'production'
import 'babel-polyfill'

const ncp = Promise.promisify(require('ncp'))

const copy = async () => {
  try {
    await Promise.all([
      ncp('src/config', 'build/config'),
      ncp('package.json', 'build/package.json')
    ])
  } catch (e) {
    console.error(e)
  }
  console.log('Copy done.')
}

copy()
