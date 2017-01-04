import { login } from '../redux/modules/auth'
import '../components/pure-button'

import './login.css'
import tagHtml from './login.html'

riot.tag('login', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/login'})
  this.mixin('store')
  this.authState = this.store.getState().auth

  // Object for errors, not rendered yet though
  this.errors = {}

  this.login = (e) => {
    e.preventDefault()

    console.log('logging in', this.refs.username, this.refs.password)

    this.store.dispatch(login(this.refs.username.value, this.refs.password.value))

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
  })

  this.on('mount', () => {
    this.log.debug('Mounted: <login>')
    this.store.resetReducers()
  })

  this.on('updated', () => {
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <login>')
    this.unsubscribe()
  })
})

if (module.hot) {
  module.hot.accept()
}
