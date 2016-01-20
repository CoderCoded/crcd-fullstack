import 'babel-polyfill'
import createStore from './redux/createStore'
import riot from 'riot'
import route from 'riot-route'

import log from './utils/log'
global.log = log
global.APP_NAME = 'crcd'

// TODO: Create a separate module for store
const store = createStore(window.__data)
riot.mixin('store', { store })
riot.mixin('appName', { appName: APP_NAME })

import logout from './redux/modules/auth'

import router from './router'

let state = store.getState()

const checkAuth = () => {
  // Normally we have user if user has session
  if (!state.auth.user) return route('/login')
  log.debug('User:', state.auth.user.username)
  // TODO: Request credentials via modal if session is lost?
}

checkAuth()

router.on('logout', () => {
  store.dispatch(logout())
})

// App-wide store listener
const unsubscribe = store.subscribe(() => {
  let newState = store.getState()
  if (state === newState) return
  state = newState
  checkAuth()
})

if (__DEVELOPMENT__ && __DEVTOOLS__) {
  const showDevTools = require('./devTools').showDevTools
  showDevTools(store)
}

log.info('App initialized.')

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    unsubscribe()
  })
}
