import Express from 'express'

const router = Express.Router()

let authn = (req, res, next) => { next() }

if (CONFIG.auth.enabled) {
  authn = (req, res, next) => {
    if (req.isAuthenticated()) {
      res.data = {
        ...res.data,
        auth: {
          user: {
            ...req.user,
            password: undefined
          }
        }
      }
      next()
    } else {
      log.debug('Adding redirectTo', req.path)
      req.session.redirectTo = req.path
      res.redirect('/login')
    }
  }
}

router.use('/login', require('./login').default)
router.use('/logout', authn, require('./logout').default)
router.use('/', authn, require('./main').default)

// Not found
router.use('*', require('./not-found').default)

module.exports = router.default = router
