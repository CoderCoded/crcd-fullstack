import { Router } from 'express'
import { NOT_FOUND } from 'http-codes'
const router = new Router()

router.all('*', function (req, res) {
  let { data } = res
  data = {
    ...data,
    app: {
      ...data.app,
      path: 'not-found',
      title: 'notFound'
    }
  }
  res.status(NOT_FOUND)
  if (req.xhr) return res.json({ data })
  res.render('not-found.html', { data })
})

export default router
