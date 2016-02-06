import 'mdl-custom/material-design-lite.scss'
import 'babel-polyfill'

import log from './utils/log'
global.log = log
global.APP_NAME = 'crcd'

import store from './store'
import riot from 'riot'
import moment from 'moment'
// import route from 'riot-route'
import './router'
import { startLoading, stopLoading } from './redux/modules/app'
import createTranslator, { changeLanguage } from './utils/translate'
import { changeLanguageSuccess, changeLanguageFail } from './redux/modules/preferences'

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

const initApp = async () => {
  // Default translator if loading locale fails
  try {
    await createTranslator()
  } catch (err) {
    log.error(err)
  }

  updateLogLevel()

  checkAuth()

  if (__DEVELOPMENT__ && __DEVTOOLS__) {
    const showDevTools = require('./devTools').showDevTools
    showDevTools(store)
  }

  log.info('App initialized.')
  store.dispatch(stopLoading())
}

initApp()

const updateLogLevel = () => {
  let level = prefState.debug ? 'debug' : 'info'
  log.info('Updating log level', level)
  log.level(level)
}

const updateTitle = () => {
  let title = store.getState().app.title
  document.title = 'Coder Coded - ' + t(title + '.title')
}

moment.locale('en', {
  longDateFormat: {
    L: 'DD/MM/YYYY'
  }
})

const tryChangeLanguage = async (lng) => {
  try {
    await changeLanguage(lng)
    store.dispatch(changeLanguageSuccess())
    moment.locale(lng)
    riot.update()
    log.debug('riot.update() called')
    updateTitle()
  } catch (err) {
    store.dispatch(changeLanguageFail(err))
  }
}

// App-wide store listener
var unsubscribe = store.subscribe(async () => {
  let { auth, preferences, app } = store.getState()
  if (authState !== auth) {
    authState = auth
    checkAuth()
  }

  if (prefState !== preferences) {
    let { pendingLng, debug } = preferences
    if (pendingLng) {
      log.debug('Changing language to', pendingLng)
      // Change language on request
      tryChangeLanguage(pendingLng)
    }
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

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    unsubscribe()
  })
}
