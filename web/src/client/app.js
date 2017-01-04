import 'babel-polyfill'

import log from './utils/log'
global.log = log
global.APP_NAME = 'crcd'

import store from './store'
import * as riot from 'riot'
// import route from 'riot-route'
import './router'
import { startLoading, stopLoading } from './redux/modules/app'

riot.mixin('store', { store })
riot.mixin('appName', { appName: APP_NAME })

store.dispatch(startLoading())

let state = store.getState()
let authState = state.auth
let prefState = state.preferences
let appState = state.app

const checkAuth = () => {
  // Normally we have user if user has session
  if (!authState.user) {
    if (appState.path !== 'login' && window.location.pathname !== '/login') {
      // TODO: Request credentials via modal if session is lost?
      // return route('/login')
      window.location.assign('/login')
    }
  } else {
    log.debug('User confirmed:', authState.user.username)
  }
}

const updateLogLevel = () => {
  let level = prefState.debug ? 'debug' : 'info'
  log.info('Updating log level', level)
  log.level(level)
}

const updateTitle = () => {
  let title = store.getState().app.title
  document.title = 'Coder Coded - ' + title
}

// App-wide store listener
var unsubscribe = store.subscribe(async () => {
  let { auth, preferences, app } = store.getState()
  if (authState !== auth) {
    authState = auth
    checkAuth()
  }

  if (prefState !== preferences) {
    let { debug } = preferences
    if (prefState.debug !== debug) {
      prefState = preferences
      updateLogLevel()
    }
    prefState = preferences
  }

  if (appState !== app) {
    appState = app
    updateTitle()
  }
})

const initApp = () => {
  updateLogLevel()

  checkAuth()

  log.info('App initialized.')
  store.dispatch(stopLoading())
}

initApp()

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    unsubscribe()
  })
}
