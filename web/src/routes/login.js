import { Router } from 'express'
const router = new Router()
import { FORBIDDEN } from 'http-codes'
import { passport } from 'crcd-db'
import nonXHR from '../utils/nonXHR'

router.get('/', function (req, res) {
  let { data } = res
  if (!data) data = {}
  if (!data.app) data.app = {}
  data = {
    ...data,
    app: {
      ...data.app,
      path: 'login',
      title: 'login'
    }
  }
  if (req.xhr) return res.json({ data })
  res.render('login.html', { data })
})

router.log = log.child({router: 'login'}, true)

router.post('/', (req, res, next) => {
  // Allow AJAX login only
  if (!req.xhr) return nonXHR(res)

  router.log.debug('Authenticating...')

  passport.authenticate('local', function (err, user, info) {
    router.log.debug('Authenticate result', { err, user, info })

    if (err) req.log.error(err)
    if (!user) req.log.info({body: req.body, info})
    if (!user || err) {
      return res.status(FORBIDDEN).json({
        message: 'Login failed.'
      })
    }
    req.logIn(user, function (err) {
      if (err) {
        req.log.error(err)
        return res.status(FORBIDDEN).json({
          message: 'Login failed.'
        })
      }

      let { redirectTo } = req.session

      router.log.debug({session: req.session})

      delete req.session['redirectTo']

      let data = {
        ...res.data,
        redirectTo,
        user
      }

      let message = 'Login success.'

      return res.json({ message, data })
    })
  })(req, res, next)
})

export default router
