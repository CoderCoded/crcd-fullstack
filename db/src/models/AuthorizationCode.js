'use strict'

// var db
// var redisClient
// var authcodes = {}

var debug = require('debug')('db:authorizationcodes')

// import { Model } from 'objection'
var RedisModel = require('./RedisModel')

// module.exports = function (database) {
//   db = database
//   redisClient = db.redisClient
//   return authcodes
// }

class AuthorizationCode extends RedisModel {

  static prefix = 'code:';

  static find (key) {
    debug('Finding %s', key)
    return this.redisClient()
      .hgetall(this.prefix + key)
  }

  static save (code, clientID, redirectURI, userID) {
    // codes[code] = { clientID: clientID, redirectURI: redirectURI, userID: userID }
    // return done(null)
    debug('Saving %s', code)
    debug(clientID)
    debug(redirectURI)
    debug(userID)
    debug(this.prefix + code)
    return this.redisClient().hmset(this.prefix + code, {
      client_id: clientID,
      redirect_uri: redirectURI,
      user_id: userID
    })
  }

  static delete (key) {
    // delete codes[key]
    // return done(null)
    debug('Deleting %s', key)
    return this.redisClient().del(this.prefix + key)
  }

}

module.exports = AuthorizationCode
