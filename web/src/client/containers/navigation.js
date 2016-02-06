import componentHandler from 'mdl-custom/material'

import '../mdl-components/mdl-nav-link'
import tagHtml from './navigation.html'

const tagAttrs = `class="${APP_NAME}-navigation mdl-navigation"`

riot.tag('navigation', tagHtml, tagAttrs, function (opts) {
  this.log = log.child({childName: 'container/app'})
  this.mixin('store')
  this.state = this.store.getState().app
  this.currentRoute = this.state.path

  this.hideDrawer = () => {
    // Hide drawer menu
    this.drawer.classList.remove('is-visible')
    this.drawerObfuscator.classList.remove('is-visible')
  }

  this.isCurrent = path => this.currentRoute === path

  this.on('mount', () => {
    componentHandler.upgradeDom()
    this.drawer = document.querySelector('.mdl-layout__drawer')
    this.drawerObfuscator = document.querySelector('.mdl-layout__obfuscator')
    this.log.debug('Mounted: <navigation>')
  })

  this.on('unmount', () => {
    this.unsubscribe()
    this.log.debug('Unmounted: <navigation>')
  })

  this.unsubscribe = this.store.subscribe(() => {
    let oldState = this.state
    this.state = this.store.getState().app
    if (oldState !== this.state) {
      this.currentRoute = this.state.path
      this.hideDrawer()
      this.update()
    }
  })
})
