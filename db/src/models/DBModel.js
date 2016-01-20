
var debug = require('debug')('db:models:dbmodel')
var Model = require('objection').Model
var RedisModel = require('./RedisModel')

class DBModel extends Model {
  static _redisClient = null;

  static redisClient = RedisModel.redisClient;

  static _redisCache = null;

  /**
   * Set or retrieve the redis cache instance.
   * If no arguments are passed the current set instance is returned.
   *
   * @param {redisCache} the cache instance to set
   */
  static redisCache (redisCache) {
    if (arguments.length) {
      this._redisCache = redisCache
    } else {
      var modelClass = this

      while (modelClass && !modelClass._redisCache) {
        var proto = Object.getPrototypeof(modelClass)
        modelClass = proto && proto.constructor
      }

      return modelClass && modelClass._redisCache
    }
  }

  /**
   * Grab the objects that userId has `permission` to from `tblname`
   * DO NOT PASS UNSAFE TABLE NAMES TO THIS FUNCTION AS IT WILL NOT CHECK THEM
   *
   * @param userId {int}
   * @param tblname {string}
   * @param permission {string}
   */
  static _findAllWithPermission (userId, permission, lastSeenId, pageSize) {
    // var sql = 'SELECT t.* FROM flatpermissions fp ' +
    //   'INNER JOIN ' + tblname + ' t ON (t.id = fp.object_id) ' +
    //   'WHERE fp.user_id=$1::bigint AND fp.permission_name=$2::text;'
    // debug(sql)

    let tableName = this.tableName

    permission = tableName + '.' + permission

    let query = this.knex()
      .select('t.*')
      .from('flatpermissions AS fp')
      .innerJoin(tableName + ' AS t', 't.id', '=', 'fp.object_id')
      .where('fp.user_id', userId)
      .andWhere('fp.permission_name', permission)

    if (lastSeenId) query.andWhere('t.id', '<', lastSeenId)

    query
      .orderBy('t.id', 'DESC')
      .limit(pageSize)

    return query
  }

  /**
   * Returns the immediate children of `parentId` where `userId` has `permission`
   */
  static findChildrenWithPermission (parentId, userId, permission, lastSeenId = 0, pageSize = 10) {
    let tableName = this.tableName

    if (permission.indexOf('.') === -1) permission = tableName + '.' + permission

    let _find = (cb) => {
      let query = this.knex()
        .select('t.*')
        .from('flatpermissions AS fp')
        .innerJoin(tableName + ' AS t', 't.id', '=', 'fp.object_id')
        .innerJoin('object_edge AS oe', 't.id', '=', 'oe.end_vertex')
        .where('fp.user_id', userId)
        .andWhere('fp.permission_name', permission)
        .andWhere('oe.start_vertex', parentId)
        .andWhere('oe.hops', 0)

      if (lastSeenId > 0) query.andWhere('t.id', '<', lastSeenId)

      query
        .orderBy('t.id', 'DESC')
        .limit(pageSize)
        .then(function (res) {
          cb(null, res)
        })
        .catch(cb)
    }

    return this.redisCache().wrapAsync(
      `{user:${userId}:rooms}:parent:${parentId}:last:${lastSeenId}:ps:${pageSize}`,
      _find,
      {ttl: 5}) // 5 seconds, 60 * 60
  }

  static findById (id) {
    let tableName = this.tableName
    if (!tableName) throw new Error('DBModel uninitialized or no tableName property defined!')

    if (id == null) return null

    let key = tableName + ':' + id

    var _find = (cb) => {
      debug('Sent actual query for ' + tableName)
      // 'SELECT * FROM room WHERE id=$1::bigint', [roomId]
      return this
        .query()
        .where('id', id)
        .then((res) => {
          let obj = res[0]
          debug('Query done')
          debug(res)

          if (!obj) return cb(null, null)

          return cb(null, obj)
        })
        .catch(cb)
    }

    debug('Caching "%s"', key)

    // Check if the object's in our Redis cache
    return this.redisCache().wrapAsync(key, _find, {ttl: 60 * 60})
  }

  static findAll (userId, lastSeenId = 0, pageSize = 10) {
    debug('Sending query for all rooms!')

    var _findAll = (cacheCallback) => {
      debug('Cache miss, checking postgres')
      this._findAllWithPermission(userId, 'view', lastSeenId, pageSize)
        .then((res) => {
          debug('Got response after cache miss!')
          debug(res)
          return cacheCallback(null, res)
        })
        .catch(cacheCallback)
    }

    let cacheKey = `{user:${userId}:rooms}:last:${lastSeenId}:ps:${pageSize}`

    debug('Cache key: %s', cacheKey)

    return this.redisCache().wrapAsync(
      cacheKey,
      _findAll,
      {ttl: 5}
    )
  }
}

module.exports = DBModel
