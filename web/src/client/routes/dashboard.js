import tagHtml from './dashboard.html'
import componentHandler from 'material-design-lite/material'

riot.tag('dashboard', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/dashboard'})

  this.on('mount', () => {
    this.log.debug('Mounted: <dashboard>')
    componentHandler.upgradeDom()
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <dashboard>')
  })
})
