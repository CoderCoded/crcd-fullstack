import { Router } from 'express'
const router = new Router()

router.get('/', function (req, res) {
  let { data } = res
  if (req.xhr) return res.json({ data })
  res.render('objects.html', { data })
})

export default router
