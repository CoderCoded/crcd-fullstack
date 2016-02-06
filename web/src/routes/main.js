import { Router } from 'express'
const router = new Router()

router.get('/', function (req, res) {
  let { data } = res
  data = {
    ...data,
    app: {
      ...data.app,
      path: '',
      title: 'home'
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
      title: 'preferences'
    }
  }
  if (req.xhr) return res.json({ data })
  res.render('main.html', { data })
})

router.get('/nutrition', function (req, res) {
  let { data } = res

  let nutrition = {
    list: []
  }

  if (req.xhr) {
    data = {
      nutrition
    }
    return res.json({ data })
  } else {
    data = {
      ...data,
      app: {
        ...data.app,
        path: 'nutrition',
        title: 'nutrition'
      },
      nutrition
    }
    res.render('main.html', { data })
  }
})

export default router
