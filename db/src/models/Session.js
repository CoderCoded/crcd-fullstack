'use strict'

var debug = require('debug')('db:models:session')
var sessions = []

exports.save = function (session, done) {
  sessions.push(session)
  return done(null, session)
}

exports.find = function (id, done) {
  debug()
  for (var i = 0, len = sessions.length; i < len; i++) {
    var session = sessions[i]
    if (session.id === id) {
      return done(null, session)
    }
  }
  return done(null, null)
}

exports.findBySessionId = function (sessionId, done) {
  for (var i = 0, len = sessions.length; i < len; i++) {
    var session = sessions[i]
    if (session.sessionId === sessionId) {
      return done(null, session)
    }
  }
  return done(null, null)
}
