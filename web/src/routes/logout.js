'use strict'

import { Router } from 'express'

import { BAD_REQUEST } from 'http-codes'
// import nonXHR from '../utils/nonXHR'

const router = new Router()

router.log = log.child({router: 'logout'}, true)

router.get('/', function (req, res) {
  router.log.debug('Logging out!')

  if (req.session) {
    req.logout()

    let data = { ...res.data }

    delete data['auth']

    let message = 'Login success.'

    if (req.xhr) {
      return res.json({ message, data })
    } else {
      return res.redirect('/login')
    }
  } else {
    if (req.xhr) {
      return res.status(BAD_REQUEST).json({ message: 'Not logged in.' })
    } else {
      return res.redirect('/')
    }
  }

  // if (req.session) {
  //   var tkn = req.session.access_token

  //   db.accessTokens
  //     .delete(req.session.access_token)
  //     .then(function (token) {
  //       router.log.debug('Token removed', {token})

  //       delete req.session.access_token
  //     })
  //     .catch(function (err) {
  //       router.log.debug(err, {tkn})
  //     })
  //     .finally(function () {
  //       req.logout()
  //       res.redirect('/')
  //     })
  // }
})

export default router
