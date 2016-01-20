'use strict'

/**
 * Module dependencies.
 */
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var BasicStrategy = require('passport-http').BasicStrategy
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
var BearerStrategy = require('passport-http-bearer').Strategy
// var User = require('./db/models/users')
// var AccessToken = require('./db/models/accesstokens')
var bcrypt = require('bcrypt')
// var uid = require('uid-safe').sync

// var util = require('util')

var User = require('./models/User')
var AccessToken = require('./models/AccessToken')
var Client = require('./models/Client')

// console.warn(User)

const DEMO_USER = {
  id: 1,
  username: 'demouser'
}

passport.log = logdb.child({module: 'passport'})

exports.enableLocalAuth = function () {
  passport.log.debug('Enabling local auth.')
  /**
   * LocalStrategy
   *
   * This strategy is used to authenticate users based on a username and password.
   * Anytime a request is made to authorize an application, we must ensure that
   * a user is logged in before asking them to approve the request.
   */
  // passport.use(new LocalStrategy(async function (username, password, done) {
  passport.use(new LocalStrategy(function (username, password, done) {
    // Temp dev mode
    passport.log.debug('LocalStrategy', username, password)
    done(null, DEMO_USER)

    // try {
    //   // Returning false in passport callback invalidates session
    //   let user = await User.findByUsername(username)

    //   if (!user) return done(null, false)

    //   if (!bcrypt.compareSync(password, user.password)) return done(null, false)

    //   console.log('Local strategy successful!')

    //   done(null, user)
    // } catch (e) {
    //   done(e)
    // }
  }))
}

passport.serializeUser(function (user, done) {
  passport.log.debug('Serializing', { user })
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  passport.log.debug('Deserializing', { id })
  done(null, DEMO_USER)
  // try {
  //   // returning false invalidates the session
  //   let user = await User.findById(id) || false

  //   passport.log.debug('Found %s', util.inspect(user))

  //   done(null, user)
  // } catch (e) {
  //   return done(e)
  // }
})

exports.enableBasicAndClientAuth = function () {
  /**
   * BasicStrategy & ClientPasswordStrategy
   *
   * These strategies are used to authenticate registered OAuth clients.  They are
   * employed to protect the `token` endpoint, which consumers use to obtain
   * access tokens.  The OAuth 2.0 specification suggests that clients use the
   * HTTP Basic scheme to authenticate.  Use of the client password strategy
   * allows clients to send the same credentials in the request body (as opposed
   * to the `Authorization` header).  While this approach is not recommended by
   * the specification, in practice it is quite common.
   */
  passport.use(new BasicStrategy(
    function (username, password, done) {
      Client.findById(username, function (err, client) {
        if (err) { return done(err) }
        if (!client) { return done(null, false) }
        if (!bcrypt.compareSync(password, client.clientSecret)) {
          passport.log.debug('Basic strategy - password does not match!')
          passport.log.debug(password)
          passport.log.debug(client.clientSecret)
          return done(null, false)
        }
        return done(null, client)
      })
    }
  ))

  passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
      Client.findById(clientId, function (err, client) {
        if (err) { return done(err) }
        if (!client) { return done(null, false) }
        if (!bcrypt.compareSync(clientSecret, client.clientSecret)) {
          passport.log.debug('Client secret strategy - secret does not match!')
          passport.log.debug(clientSecret)
          passport.log.debug(client.clientSecret)
          return done(null, false)
        }
        return done(null, client)
      })
    }
  ))
}

exports.enableBearerAuth = function () {
  /**
   * BearerStrategy
   *
   * This strategy is used to authenticate users based on an access token (aka a
   * bearer token).  The user must have previously authorized a client
   * application, which is issued an access token to make requests on behalf of
   * the authorizing user.
   */
  passport.use(new BearerStrategy(
    function (accessToken, done) {
      AccessToken
        .find(accessToken)
        .then(function (token) {
          if (!token) return done(null, false)

          return User.findById(token.user_id)
            .then(function (user) {
              if (!user) return done(null, false)
              // to keep this example simple, restricted scopes are not implemented,
              // and this is just for illustrative purposes
              var info = { scope: '*' }
              done(null, user, info)
            })
        })
        .catch(done)
    }
  ))

  // Return the middleware provided by Passport
  exports.bearer = passport.authenticate('bearer', {session: false})
  // exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false })
}

exports.default = exports.passport = passport
