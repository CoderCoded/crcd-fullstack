import '../mdl-components/mdl-nav-link'
import tagHtml from './navigation.html'

const tagAttrs = `class="${APP_NAME}-navigation mdl-navigation"`

riot.tag('navigation', tagHtml, tagAttrs, function (opts) {
  this.on('mount', () => {
  })
})
