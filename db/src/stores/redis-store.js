
/**
 * This is a very basic example of how you can implement your own Redis-based
 * cache store
 */

function redisStore (args) {
  args = args || {}
  var self = {}
  var ttlDefault = args.ttl
  self.name = 'redis'

  var redisClient = args.redis

  function handleResponse (cb, opts) {
    cb = cb || function (err) { if (err) throw err }
    opts = opts || {}

    return function (err, result) {
      if (err) { return cb(err) }

      if (opts.parse) {
        result = JSON.parse(result)
      }

      try {
        cb(null, result)
      } catch (e) {
        console.warn(opts)
        console.warn(e.stack)
      }
    }
  }

  self.get = function (key, options, cb) {
    if (typeof options === 'function') {
      cb = options
    }

    redisClient.get(key, handleResponse(cb, {parse: true}))
  }

  self.set = function (key, value, options, cb) {
    if (typeof options === 'function') {
      cb = options
      options = {}
    }
    options = options || {}

    var ttl = (options.ttl || options.ttl === 0) ? options.ttl : ttlDefault

    var val = JSON.stringify(value)

    if (ttl) {
      redisClient.setex(key, ttl, val, handleResponse(cb))
    } else {
      redisClient.set(key, val, handleResponse(cb))
    }
  }

  self.del = function (key, options, cb) {
    if (typeof options === 'function') {
      cb = options
    }
    redisClient.del(key, handleResponse(cb))
  }

  self.ttl = function (key, cb) {
    redisClient.ttl(key, handleResponse(cb))
  }

  // DO NOT USE KEYS IN PRODUCTION
  // self.keys = function (pattern, cb) {
  //   if (typeof pattern === 'function') {
  //     cb = pattern
  //     pattern = '*'
  //   }

  //   redisClient.keys(pattern, handleResponse(cb))
  // }

  self.isCacheableValue = function (value) {
    return value !== null && value !== undefined
  }

  return self
}

module.exports = {
  create: function (args) {
    return redisStore(args)
  }
}
