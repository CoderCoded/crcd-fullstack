import './app.scss'
import tagHtml from './app.html'
import './navigation'
import componentHandler from 'material-design-lite/material'
import '../mdl-components/mdl-button'

riot.tag('app', tagHtml, function (opts) {
  this.mixin('appName')
  this.log = log.child({childName: 'container/app'})

  this.on('mount', () => {
    componentHandler.upgradeDom()
    this.log.debug('Mounted: <app>')
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <app>')
  })
})
