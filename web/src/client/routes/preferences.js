// import preferences, { fetchDataIfNeeded } from '../redux/modules/preferences'
import tagHtml from './preferences.html'

riot.tag('preferences', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/preferences'})
  this.mixin('store')

  this.on('mount', () => {
    this.log.debug('Mounted: <preferences>')
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <preferences>')
    // this.unsubscribe()
  })

  /* Store listener
   * ==============
   */
  // this.unsubscribe = this.store.subscribe(() => {
  //   let prevState = this.state
  //   this.state = this.store.getState().preferences
  //   if (prevState !== this.state) {
  //     this.log.debug('State updated')
  //     this.update()
  //   }
  // })
})
