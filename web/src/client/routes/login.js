import componentHandler from 'mdl-custom/material'

import { login } from '../redux/modules/auth'
import { changeLanguage } from '../redux/modules/preferences'
import '../mdl-components/mdl-button'
import '../mdl-components/mdl-textfield'

import './login.scss'
import tagHtml from './login.html'

riot.tag('login', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/login'})
  this.mixin('store')
  this.authState = this.store.getState().auth
  this.prefState = this.store.getState().preferences
  this.langOptions = [{
    name: 'English',
    value: 'en'
  }]
  this.errors = {}

  this.changeLanguage = (e) => {
    this.log.debug('changeLanguage:', e.item.value)
    let lng = e.item.value
    if (lng && this.prefState.lng !== lng) this.store.dispatch(changeLanguage(lng))
  }

  this.validate = () => {
    this.errors = {}
    if (!this.username.value || this.username.value.length < 1) {
      this.errors.username = 'empty'
    }
    if (!this.password.value || this.password.value.length < 1) {
      this.errors.password = 'empty'
    }
    let valid = !this.errors.username && !this.errors.password
    this.log.debug('Validated', valid)
    return valid
  }

  this.login = (e) => {
    e.preventDefault()

    let valid = this.validate()

    if (!valid) {
      this.update()
      return false
    }

    this.store.dispatch(login(this.username.value, this.password.value))
    // this.store.dispatch(login('demouser', 'demopass'))

    // Prevent normal submit
    return false
  }

  this.unsubscribe = this.store.subscribe(() => {
    let authState = this.store.getState().auth

    if (this.authState !== authState) {
      this.authState = authState
      // Check if logged in
      let { user, redirectTo, loginFailed } = this.authState

      console.log('Login auth state', this.authState)

      if (loginFailed) {
        this.errors.username = 'invalid'
        this.errors.password = 'invalid'
        this.update()
        return
      }

      if (user) {
        // route(redirectTo || '/')
        // Full refresh to fix layout
        window.location.assign(redirectTo || '/')
        return
      }
    }

    let prefState = this.store.getState().preferences

    // TODO: This could be done on app top-level using riot.update()
    if (this.prefState !== prefState) {
      this.prefState = prefState
      if (!prefState.pendingLng) {
        this.log.debug('Preferences changed, lng:', this.prefState.lng)
        this.update()
      }
    }
  })

  this.on('mount', () => {
    this.log.debug('Mounted: <login>')
    // componentHandler.upgradeDom()
    this.store.resetReducers()
    componentHandler.upgradeDom()
  })

  this.on('updated', () => {
    // componentHandler.upgradeDom()
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <login>')
    this.unsubscribe()
  })
})

if (module.hot) {
  module.hot.accept()
}
