const MODULENAME = require('../package.json').name
import CONFIG from 'config'
import bunyan, { INFO, DEBUG } from 'bunyan'

// Add global logger
global.logdb = bunyan.createLogger({
  name: MODULENAME,
  serializers: bunyan.stdSerializers,
  level: __DEVELOPMENT__ ? DEBUG : INFO
})

var db = require('./db')
var redisClient = db.redisClient
// var utils = require('./utils')
// var config = require('config')

var Model = require('objection').Model
Model.knex(db.knex)

var DBModel = require('./models/DBModel')
DBModel.redisClient(redisClient)
DBModel.redisCache(db.redisCache)

var RedisModel = require('./models/RedisModel')
RedisModel.redisClient(redisClient)

exports.redisClient = redisClient

exports.User = require('./models/User')
exports.Room = require('./models/Room')
exports.AccessToken = require('./models/AccessToken')
exports.AuthorizationCode = require('./models/AuthorizationCode')
exports.Permission = require('./models/Permission')

// console.warn(exports.Permission)

exports.authz = {
  check: exports.Permission.middleware
}

if (CONFIG.auth.enabled) {
  exports.authn = require('./auth')
  exports.passport = exports.authn.passport
}

if (CONFIG.oauth2.enabled) {
  exports.oauth2 = require('./oauth2')
}

// oAuth Client dummy implementation
// exports.clients = require('./models/Client')
