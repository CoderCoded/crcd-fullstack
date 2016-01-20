'use strict'

var CONFIG = require('config')
// var debug = require('debug')('db:index')
// var util = require('util')

var yaml = require('js-yaml')
var fs = require('fs')
var path = require('path')

var Promise = require('bluebird')
Promise.longStackTraces()

process.on('unhandledRejection', function (reason, promise) {
  logdb.debug('unhandledRejection')
  logdb.debug(reason)
  logdb.debug(promise)
  // See Promise.onPossiblyUnhandledRejection for parameter documentation
})

var bcrypt = require('bcrypt')
Promise.promisifyAll(bcrypt)

let { host, port, user, password, database } = CONFIG.db.postgres

const conString = `postgres://${user}:${password}@${host}:${port}/${database}`

exports.knex = require('knex')({
  client: 'pg',
  connection: conString,
  debug: true
})

// Promise.longStackTraces()
var Redis = require('ioredis')
// redis.debug_mode = true

Redis.Promise.onPossiblyUnhandledRejection(function (error) {
  // you can log the error here.
  // error.command.name is the command name, here is 'set'
  // error.command.args is the command arguments, here is ['foo']
  logdb.debug('Unhandled rejection')
  logdb.debug(error)
})

let redisConf = CONFIG.db.redis

var redis

if (redisConf.cluster.enable) {
  // Use redis cluster
  redis = new Redis.Cluster(redisConf.cluster.nodes, redisConf.cluster.options)
} else {
  redis = new Redis(redisConf.port || 6379, redisConf.host || '127.0.0.1')
}

exports.redisClient = redis
// Preload lua scripts

redis.log = logdb.child({ db: 'redis' }, true)

redis.on('error', function (e) {
  redis.log.error('Redis client ERRORED', e)
})

redis.on('connect', function () {
  redis.log.info('Redis client CONNECTED')
})

var scripts =
exports.scripts = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'db_scripts.yml'), 'utf8'))
// redis.log.debug(scripts)

redis.defineCommand('removeToken', {lua: scripts.removeToken, numberOfKeys: 1})

redis.defineCommand('saveToken', {lua: scripts.saveToken, numberOfKeys: 2})

redis.defineCommand('cachePermission', {lua: scripts.cachePermission, numberOfKeys: 1})

var cacheManager = require('cache-manager')
var redisStore = require('./stores/redis-store')

exports.redisCache = Promise.promisifyAll(cacheManager.caching({store: redisStore, ttl: 100, redis: exports.redisClient}))
