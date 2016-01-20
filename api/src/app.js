global.Promise = require('bluebird')
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production'
global.APPNAME = require('../package.json').name

import Express from 'express'
// import path from 'path'
import PrettyError from 'pretty-error'
import bunyan from 'bunyan'

const pretty = new PrettyError()
const app = new Express()
global.log = bunyan.createLogger({name: APPNAME})

// Passport configuration
// require('./auth')

app.use(require('./routes'))

// Error handler
app.use(function (err, req, res, next) {
  console.log(pretty.render(err))
  next(err)
})

const port = process.env.PORT || 3000
app.listen(port, (err) => {
  if (err) {
    log.error(err)
  }
  log.info('Server [%s] listening on port %s', APPNAME, port)
})
