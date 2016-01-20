import Express from 'express'

// import { passport } from 'crcd-db'

const router = Express.Router()
// var passport = require('passport')
// var auth = require('./auth')
// var db = require('crcd-db')

let authn = (req, res, next) => { next() }

if (CONFIG.auth.enabled) {
  authn = (req, res, next) => {
    if (req.isAuthenticated()) {
      res.data = {...res.data, auth: { user: req.user }}
      next()
    } else {
      log.debug('Adding redirectTo', req.path)
      req.session.redirectTo = req.path
      res.redirect('/login')
    }
  }
}

router.use('/logout', require('./routes/logout').default)
// router.use('/register', require('./register'))
router.use('/login', require('./routes/login').default)
router.use('/objects', authn, require('./routes/objects').default)
router.use('/roles', authn, require('./routes/roles').default)
router.use('/', authn, require('./routes/main').default)

// router.use('/account', require('./account'))

// router.use('/oauth2', require('./oauth2'))

// router.use('/clients', require('./client'))

// var user = {}
// user.info = [
//   auth.bearer,
//   function (req, res) {
//     // req.authInfo is set using the `info` argument supplied by
//     // `BearerStrategy`.  It is typically used to indicate scope of the token,
//     // and used in access control checks.  For illustrative purposes, this
//     // example simply returns the scope in the response.
//     res.json({ user_id: req.user.id, name: req.user.name, scope: req.authInfo.scope })
//   }
// ]

export default router
