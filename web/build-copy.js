global.Promise = require('bluebird')
// const __DEVELOPMENT__ = process.env.NODE_ENV !== 'production'
import 'babel-polyfill'

const ncp = Promise.promisify(require('ncp'))
// const replace = Promise.promisify(require('replace-in-file'))

const copy = async () => {
  try {
    await Promise.all([
      ncp('src/config', 'build/config'),
      ncp('src/static', 'build/static'),
      ncp('src/views', 'build/views'),
      ncp('package.json', 'build/package.json')
    ])
    // let changedFiles = await replace({
    //   files: 'build/package.json',
    //   replace: 'file:../db',
    //   with: 'file:../../db'
    // })
    // console.log('Modified files:', changedFiles.join(', '))
  } catch (e) {
    console.error(e)
  }
  console.log('Copy done.')
}

copy()
