'use strict'

import DBModel from './DBModel'

var bcrypt = require('bcrypt')
var debug = require('debug')('db:models:user')
var util = require('util')

// Cache users for 60 minutes in redis
var ttl = 60 * 60

class User extends DBModel { // combine(DBModel, Model) {

  static tableName = 'user_account';

  static jsonSchema = {
    type: 'object',
    required: ['email'],

    properties: {
      id: {type: 'string'},
      email: {type: 'string', format: 'email'},
      first_name: {type: 'string'},
      last_name: {type: 'string'},
      last_login: {type: 'string'}
    }
  };

  static findByUsername (username) {
    return this.findByEmail(username)
  }

  static findByEmail (email) {
    // var sql = 'SELECT * FROM user_account WHERE email=$1 LIMIT 1;'

    return this
      .query()
      .where('email', email)
      .limit(1)
      .then((res) => {
        var user = res[0]

        if (!user) return null

        // User account disabled
        if (!user.is_active) return null

        debug('Found user')
        debug(util.inspect(user))

        // Cache to redis for further access
        var key = 'user:' + user.id
        this.redisCache().set(key, JSON.stringify(user), {ttl: ttl})

        let last_login = new Date().toISOString()
        user.last_login = last_login

        // Update the TTL to postgresql
        // var sql = 'UPDATE user_account SET last_login=$1 WHERE id=$2'
        user
          .$query()
          .patch({last_login})
          .then(function (patch) {
            debug('We patched the user!')
            debug(patch)
          })
          .catch(function (err) {
            debug('Error setting last_login')
            debug(err)
          // ignore it?
          })

        // Don't wait for the update/patch to finish, just return
        return user
      })
  }

  static genHash (passwd) {
    // TODO: increase salt factor?
    return bcrypt
      .genSaltAsync(10)
      .then(function (salt) {
        debug('Created salt %s', salt)
        debug('Trying to hash %s', passwd)
        return bcrypt.hashAsync(passwd, salt)
      })
      .then(function (hash) {
        debug('Created pwhash %s', hash)
        // debug('Hash matches pw?: ' + bcrypt.compareSync(passwd, hash))
        return hash
      })
  }

  // http://vincit.github.io/objection.js/global.html#ModelOptions
  // http://vincit.github.io/objection.js/Model.html#$beforeUpdate
  $beforeUpdate (opt) {
    debug('BEFOREUPDATE')
    debug(this)

    if (this.password == null) return

    // Check if password exists and is already a bcrypt hash, do nothing
    if (this.password.substring(0, 4) === '$2a$') return

    return User
      .genHash(this.password)
      .then((pw) => {
        this.password = pw
      })
  }
}

module.exports = User
