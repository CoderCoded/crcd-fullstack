import tagHtml from './main.html'

riot.tag('main', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/main'})

  this.on('mount', () => {
    this.log.debug('Mounted: <main>')
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <main>')
  })
})
