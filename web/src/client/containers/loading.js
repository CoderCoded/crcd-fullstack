import tagHtml from './loading.html'

riot.tag('loading', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/loading'})

  // this.on('update', () => {
  // })

  this.on('mount', () => {
    this.log.debug('Mounted: <loading>')
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <loading>')
  })
})
