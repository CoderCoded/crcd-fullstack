import tagHtml from './dashboard.html'

riot.tag('dashboard', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/dashboard'})

  this.on('mount', () => {
    this.log.debug('Mounted: <dashboard>')
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <dashboard>')
  })
})
