import './app.css'
import tagHtml from './app.html'
import './navigation'

riot.tag('app', tagHtml, function (opts) {
  this.mixin('appName')
  this.log = log.child({childName: 'container/app'})

  this.on('mount', () => {
    this.log.debug('Mounted: <app>')
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <app>')
  })
})
