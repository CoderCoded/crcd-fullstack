
var DBModel = require('./DBModel')

var debug = require('debug')('db:models:permission')

class Permission extends DBModel {

  static cacheTime = 5;

  static check (userId, permission, objectId) {
    if (userId == null || permission == null || objectId == null) {
      return Promise.reject(new Error('Invalid params'))
    }
    // permission = 'room.stupid'
    debug(`Checking if userId(${userId.toString().green}) has permission ` +
          `"${permission.toString().bold.green}" in objectId(${objectId.toString().green})`)
    // Check our cache first

    var redisClient = this.redisClient()

    return redisClient
      .hget('user:' + userId + ':permissions', objectId + ':' + permission)
      .then((res) => {
        if (res != null) {
          res = JSON.parse(res)
          debug('Permission cache hit, returning "%s"', res)
          return res
        }

        debug('Permission cache miss, checking from postgres')

        var knex = this.knex()

        // var sql = 'SELECT * FROM flatpermissions WHERE user_id=$1 AND permission_name=$2 AND object_id=$3'
        // return exports.query(sql, [userId, permission, objectId])
        return knex.select('*')
          .from('flatpermissions')
          .where({
            user_id: userId,
            permission_name: permission,
            object_id: objectId
          })
          .then((res) => {
            var permissionGranted = false

            // Assume that any rows returned means we have a permissions
            if (res.length > 0) {
              permissionGranted = true
            }

            // cache the permission for future use
            redisClient
              .cachePermission([
                'user:' + userId + ':permissions', // keys[1] - key value
                objectId + ':' + permission, // argv[1] - field value
                permissionGranted, // argv[2] - result of the permission check
                this.cacheTime // argv[3] - cache time
              ])
              .tap(function () {
                debug('Permission check result cached to redis for %s seconds', this.cacheTime)
              })

            return permissionGranted
          })
      })
      .tap(function (permissionGranted) {
        if (!permissionGranted) {
          debug('Permission %s' + ' denied '.yellow.bold + '\uD83D\uDE1E'.yellow, permission)
        } else {
          debug('Permission %s' + ' granted '.green.bold + '\uD83D\uDE03'.green, permission)
        }
      })
      .catch(function (err) {
        debug(err)
        return false
      })
  }

  static middleware (permissionName, config) {
    if (permissionName == null) throw new Error('Please specify a permission to check')

    var idParam = 'id'

    if (config == null) config = {}

    if (config.idParam) idParam = config.idParam

    return function (req, res, next) {
      debug('Permission middleware checking')
      debug(req.user.id, permissionName, req.params[idParam])
      Permission
        .check(req.user.id, permissionName, req.params[idParam])
        .then(function (permissionGranted) {
          if (permissionGranted === true) return next()

          return res.json({ok: false, err: 'Unauthorized'})
        })
        .catch(next)
    }
  }

}

module.exports = Permission
