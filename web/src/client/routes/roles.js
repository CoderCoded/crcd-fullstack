import roles, { fetchDataIfNeeded } from '../redux/modules/roles'
import tagHtml from './roles.html'

riot.tag('roles', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/roles'})
  this.mixin('store')

  this.on('mount', () => {
    this.log.debug('Mounted: <roles>')
    this.store.registerReducers({ roles }, true)
    this.store.dispatch(fetchDataIfNeeded())
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <roles>')
    this.unsubscribe()
  })

  this.unsubscribe = this.store.subscribe(() => {
    this.state = this.store.getState().roles
    this.update()
  })
})
