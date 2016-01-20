import route from 'riot-route'
import observable from 'riot-observable'
import log from './utils/log'

route.log = log.child({childName: 'router'})

// Set base not to use #
route.base('/')

// Create subroute for listening all changes
const router = route.create()

observable(router)

router((first) => {
  // Trigger change for nav updates
  router.current = '/' + first
  router.trigger('change', router.current)
})

router('/logout..', () => {
  route.log.info('Logging out')
  router.trigger('logout')
})

const appMountPoint = '#app'
const contentMountPoint = '#content'

// var mountedTag = null
var appMounted = false  // Whether app is the 'app' or some common view

const mountApp = () => {
  return new Promise((resolve, reject) => {
    if (appMounted) return resolve()
    require.ensure([], () => {
      require('./containers/app')
      route.log.debug('Mounting: <app>')
      riot.mount(appMountPoint, 'app')
      appMounted = true
      resolve()
    })
  })
}

const appRouter = route.create()

appRouter('/login', () => {
  route.log.debug('Route /login')
  require.ensure([], () => {
    require('./routes/login')
    appMounted = false
    riot.mount(appMountPoint, 'login')
  })
})

appRouter('/objects..', () => {
  route.log.debug('Route /objects..')
  require.ensure([], async () => {
    require('./routes/objects')
    await mountApp()
    route.log.debug('Mounting: <objects>')
    riot.mount(contentMountPoint, 'objects')
  })
})

appRouter('/roles..', () => {
  route.log.debug('Route /roles..')
  require.ensure([], async () => {
    require('./routes/roles')
    await mountApp()
    route.log.debug('Mounting: <roles>')
    riot.mount(contentMountPoint, 'roles')
  })
})

appRouter('/', () => {
  route.log.debug('Route /')
  require.ensure([], async () => {
    require('./routes/main')
    await mountApp()
    route.log.debug('Mounting: <main>')
    riot.mount(contentMountPoint, 'main')
  })
})

appRouter('/..', () => {
  route.log.debug('Route /..')
  require.ensure([], () => {
    require('./routes/not-found')
    route.log.debug('Mounting: <not-found>')
    appMounted = false
    riot.mount(appMountPoint, 'not-found')
  })
})

route.start(true)

export default router

// check if HMR is enabled
if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    route.stop()
  })
}
