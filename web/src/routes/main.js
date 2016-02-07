import { Router } from 'express'
const router = new Router()

router.get('/', function (req, res) {
  let { data } = res
  data = {
    ...data,
    app: {
      ...data.app,
      path: '',
      title: 'Dashboard'
    }
  }
  if (req.xhr) return res.json({ data })
  res.render('main.html', { data })
})

router.get('/preferences', function (req, res) {
  let { data } = res
  data = {
    ...data,
    app: {
      ...data.app,
      path: 'preferences',
      title: 'Preferences'
    }
  }
  if (req.xhr) return res.json({ data })
  res.render('main.html', { data })
})

export default router
