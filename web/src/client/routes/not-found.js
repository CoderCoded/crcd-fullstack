import tagHtml from './not-found.html'

riot.tag('not-found', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/not-found'})

  this.on('mount', () => {
    this.log.debug('Mounted: <not-found>')
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <not-found>')
  })
})
