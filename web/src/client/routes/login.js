import componentHandler from 'material-design-lite/material'

import { login } from '../redux/modules/auth'

import './login.css'
import tagHtml from './login.html'

riot.tag('login', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/login'})
  this.mixin('store')

  this.unsubscribe = this.store.subscribe(() => {
    this.state = this.store.getState().auth

    let { user, redirectTo } = this.state

    if (user) {
      // route(redirectTo || '/')
      // Temp fix for MDL layout
      window.location.assign(redirectTo || '/')
      return
    }

    this.update()
  })

  this.on('mount', () => {
    this.log.debug('Mounted: <login>')
    componentHandler.upgradeDom()
    this.store.resetReducers()
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <login>')
    this.unsubscribe()
  })

  this.login = e => {
    e.preventDefault()
    // this.store.dispatch(login(this.username.value, this.password.value))
    this.store.dispatch(login('demouser', 'demopass'))

    // Prevent normal submit
    return false
  }
})
