import './navigation'
import './app.css'
import tagHtml from './app.html'

riot.tag('app', tagHtml, function (opts) {
  this.mixin('appName')
  this.mixin('store')
  this.log = log.child({childName: 'container/app'})
  this.state = this.store.getState().app
  this.loading = false // this.state.loading
  this.title = this.state.title

  this.on('mount', () => {
    this.log.debug('Mounted: <app>')
  })

  this.on('unmount', () => {
    this.unsubscribe()
    this.log.debug('Unmounted: <app>')
  })

  this.unsubscribe = this.store.subscribe(() => {
    let oldState = this.state
    this.state = this.store.getState().app
    if (oldState !== this.state) {
      // this.loading = this.state.loading
      this.title = this.state.title
      this.log.debug('App state changed, loading:', this.loading)
      this.update()
    }
  })
})
