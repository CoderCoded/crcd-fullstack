global.Promise = require('bluebird')
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production'
global.CONFIG = require('config')
const APP_NAME = require('../package.json').name
const APP_DESC = require('../package.json').description

import 'babel-polyfill'

import http from 'http'
import Express from 'express'
import session from 'express-session'
import favicon from 'serve-favicon'
import compression from 'compression'
import path from 'path'
import nunjucks from 'nunjucks'
import bunyan, { INFO, DEBUG } from 'bunyan'
import cuid from 'cuid'
import serveStatic from 'serve-static'
import bodyParser from 'body-parser'
import { INTERNAL_SERVER_ERROR } from 'http-codes'

const RedisStore = require('connect-redis')(session)

const app = new Express()
const server = http.createServer(app)
global.log = bunyan.createLogger({
  name: APP_NAME,
  serializers: bunyan.stdSerializers,
  level: __DEVELOPMENT__ ? DEBUG : INFO
})

// Reload if dev mode
if (__DEVELOPMENT__) {
  const reload = require('reload')
  // Wait 1500ms (adjust this if server restart takes longer)
  reload(server, app, 1500)
}

app.use(compression())
app.use(favicon(path.join(__dirname, 'static', 'icons/favicon.ico')))

app.use(serveStatic(path.join(__dirname, 'static')))

if (__DEVELOPMENT__) {
  // Include .tmp for static views etc
  app.use(serveStatic(path.join(__dirname, '../.tmp/static')))
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

if (CONFIG.router.enabled) {
  const nunjucksEnv = nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
  })
  // Poor man's json filter
  nunjucksEnv.addFilter('json', (input) => {
    return JSON.stringify(input || {}, null, 2)
  })

  let assetsPath = '/dist'
  if (__DEVELOPMENT__) {
    assetsPath = 'http://' + process.env.WEBPACK_HOST + ':' + process.env.WEBPACK_PORT + assetsPath
  }
  nunjucksEnv.addGlobal('description', APP_DESC)
  nunjucksEnv.addGlobal('assetsPath', assetsPath)
  nunjucksEnv.addGlobal('__DEVELOPMENT__', __DEVELOPMENT__)
}

app.set('view engine', 'html')

// Sessions for non-logged in users
if (CONFIG.session.enabled) {
  const redisClient = require('crcd-db').redisClient

  let {
    secret,
    httpOnly,
    saveUninitialized,
    resave
  } = CONFIG.session

  app.use(session({
    store: new RedisStore({
      client: redisClient
    }),
    httpOnly,
    saveUninitialized,
    resave,
    secret
  }))
}

// Passport configuration
if (CONFIG.auth.enabled) {
  const authn = require('crcd-db').authn
  authn.enableLocalAuth()
  const passport = authn.passport
  app.use(passport.initialize())
  app.use(passport.session())
}

// Bunyan logs for each request
app.use((req, res, next) => {
  req.log = log.child({ req_id: cuid() }, true)
  req.log.info({ req: req, xhr: req.xhr, user: req.user })
  next()
})

if (CONFIG.router.enabled) app.use(require('./router').default)

// Error handler
app.use((err, req, res, next) => {
  log.error(err)
  res.status(INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error.'
  })
  next(err)
})

const port = process.env.PORT || 3000
server.listen(port, (err) => {
  if (err) {
    log.error(err)
  }
  log.info('Server listening on port %s', port)
})
