
/**
 * Base class for any db model that uses Redis only
 * @constructor
 */
function RedisModel () {
  /* empty on purpose */
}

/**
 * The redis client instance to use
 *
 * @type {Function}
 */
RedisModel._redisClient = null

/**
 * Set the redis client for this model
 *
 * @param {redis=} redis
 *    The redis client to set.
 */
RedisModel.redisClient = function (redis) {
  if (arguments.length) {
    this._redisClient = redis
  } else {
    var modelClass = this

    while (modelClass && !modelClass._redisClient) {
      var proto = Object.getPrototypeof(modelClass)
      modelClass = proto && proto.constructor
    }

    return modelClass && modelClass._redisClient
  }
}

module.exports = RedisModel
