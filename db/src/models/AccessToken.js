'use strict'

var debug = require('debug')('db:accesstokens')
var util = require('util')
var Promise = require('bluebird')

var RedisModel = require('./RedisModel')

class AccessToken extends RedisModel {

  /**
   * @private
   */
  static tokenPrefix = 'tkn:';

  /**
   * @private
   */
  static tokenSuffix = 'tokens';

  /**
   * @private
   */
  static userPrefix = 'user:';

  // constructor (args) {
  //   super()
  //   if (args.length) {
  //     this.token = args
  //   } else {
  //     this.token = AccessToken.generate()
  //   }
  // }

  /**
   *
   */
  static getUserId (token) {
    try {
      var res = token.split('-')[1]
      return res || ''
    } catch (err) {
      return ''
    }
  }

  static getTokenKey (token) {
    var userId = this.getUserId(token)

    if (!userId || userId.length !== 19) return null

    // `{${userPrefix}:${userId}}:${tokenPrefix}:${token}`
    return '{' + this.userPrefix + userId + '}:' + this.tokenPrefix + token
  }

  static getTokenListKey (token) {
    var userId = this.getUserId(token)

    if (!userId || userId.length !== 19) return null

    return '{' + this.userPrefix + userId + '}:' + this.tokenSuffix
  }

  static save (token, params) {
    var userToken = this.getTokenKey(token)
    var userTokens = this.getTokenListKey(token)
    var args = []

    for (var key in params) {
      args.push(key, params[key])
    }

    debug('Saving token')
    debug(userToken)
    debug(userTokens)
    debug(args)

    return this.redisClient()
      .saveToken(userToken, userTokens, args)
      .return(token)
  }

  static generateAndSave (params) {
    var {user_id, ...rest} = params

    if (user_id == null) throw new Error('Please supply user_id as parameter')

    var token = `x-${user_id}-${uid(20)}`

    return this.save(token, {
      issued_at: +new Date(),
      revoked: false,
      user_id: user_id,
      ...rest
    })
  }

  static delete (token) {
    token = this.getTokenKey(token)

    if (!token) return Promise.resolve(null)

    debug('Deleting session token from Redis')

    return this.redisClient()
      .removeToken(token)
      .return(token)
  }

  static find (token) {
    token = this.getTokenKey(token)

    if (!token) return Promise.resolve(null)

    return this.redisClient()
      .hgetall(token)
      .then((res) => {
        debug('Found token! %s', util.inspect(res))
        if (Object.keys(res).length === 0) return null

        return res
      })
  }

}

var uid = require('uid-safe').sync
module.exports = AccessToken
