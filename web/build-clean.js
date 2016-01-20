global.Promise = require('bluebird')
// const __DEVELOPMENT__ = process.env.NODE_ENV !== 'production'
import 'babel-polyfill'

import del from 'del'

const clean = async () => {
  try {
    await del(['.tmp', 'build/*'], { dot: true })
  } catch (e) {
    console.error(e)
  }
  console.log('Clean done.')
}

clean()
