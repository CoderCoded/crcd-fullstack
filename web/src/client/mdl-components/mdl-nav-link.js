import tagHtml from './mdl-nav-link.html'
import router from '../router'

const tagAttrs = 'class="mdl-navigation__link { mdl-navigation__link--current: isCurrent }"'

riot.tag('mdl-nav-link', tagHtml, tagAttrs, function (opts) {
  this.isCurrent = router.current === opts.href

  router.on('change', (path) => {
    this.isCurrent = path === opts.href
    this.update()
  })
})
