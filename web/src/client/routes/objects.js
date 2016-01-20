import objects, { fetchDataIfNeeded } from '../redux/modules/objects'
import tagHtml from './objects.html'

riot.tag('objects', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/objects'})
  this.mixin('store')

  this.on('update', () => {
    // console.log('object state updated')
  })

  this.on('mount', () => {
    this.log.debug('Mounted: <objects>')
    this.store.registerReducers({ objects }, true)
    this.store.dispatch(fetchDataIfNeeded())
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <objects>')
    this.unsubscribe()
  })

  this.unsubscribe = this.store.subscribe(() => {
    // TODO: Find out a neat way to check if update needed
    let prevState = this.state
    this.state = this.store.getState().objects
    if (prevState !== this.state) {
      this.log.debug('State updated')
      this.update()
    }
  })
})
