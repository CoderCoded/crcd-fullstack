import route from 'riot-route'
// import observable from 'riot-observable'
import log from './utils/log'
import store from './store'
import { locationChange, startLoading, stopLoading } from './redux/modules/app'
import { logout } from './redux/modules/auth'

route.log = log.child({childName: 'router'})

// Set base not to use #
route.base('/')

// Create subroute for listening all changes
const router = route.create()

// observable(router)

router((first) => {
  // Store route in redux
  store.dispatch(locationChange(first))
})

const appMountPoint = '#app'
const contentMountPoint = '#content'

// var mountedTag = null
var appMounted = false  // Whether app is the 'app' or some common view

const mountApp = () => {
  return new Promise((resolve, reject) => {
    if (appMounted) {
      return resolve()
    }
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

appRouter('/login..', () => {
  route.log.debug('Route /login')
  require.ensure([], () => {
    require('./routes/login')
    appMounted = false
    riot.mount(appMountPoint, 'login')
  })
})

appRouter('/logout..', () => {
  route.log.info('Logging out')
  store.dispatch(logout())
})

appRouter('/preferences..', () => {
  route.log.debug('Route /preferences..')
  store.dispatch(startLoading())
  require.ensure([], async () => {
    require('./routes/preferences')
    try {
      await mountApp()
    } catch (err) {
      route.log.error(err)
    }
    route.log.debug('Mounting: <preferences>')
    riot.mount(contentMountPoint, 'preferences')
    store.dispatch(stopLoading())
  })
})

appRouter('/nutrition..', () => {
  route.log.debug('Route /nutrition..')
  store.dispatch(startLoading())
  require.ensure([], async () => {
    require('./routes/nutrition')
    try {
      await mountApp()
    } catch (err) {
      route.log.error(err)
    }
    route.log.debug('Mounting: <nutrition>')
    riot.mount(contentMountPoint, 'nutrition')
    store.dispatch(stopLoading())
  })
})

appRouter('/', () => {
  route.log.debug('Route /')
  store.dispatch(startLoading())
  require.ensure([], async () => {
    require('./routes/dashboard')
    try {
      await mountApp()
    } catch (err) {
      route.log.error(err)
    }
    route.log.debug('Mounting: <dashboard>')
    riot.mount(contentMountPoint, 'dashboard')
    store.dispatch(stopLoading())
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

var unsubscribe = store.subscribe(() => {
  // Wait for translator
  if (!store.getState().app.loading) {
    route.start(true)
    unsubscribe()
  }
})

// check if HMR is enabled
if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    unsubscribe()
    route.stop()
  })
}
