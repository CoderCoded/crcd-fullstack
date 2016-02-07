import '../components/nav-link'
import './navigation.css'
import tagHtml from './navigation.html'

const tagAttrs = 'class="navigation"'

riot.tag('navigation', tagHtml, tagAttrs, function (opts) {
  this.log = log.child({childName: 'container/navigation'})
  this.mixin('store')
  this.state = this.store.getState().app
  this.currentRoute = this.state.path

  this.isCurrent = path => this.currentRoute === path

  this.on('mount', () => {
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
      this.update()
    }
  })
})
