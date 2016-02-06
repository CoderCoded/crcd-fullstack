import tagHtml from './mdl-card.html'
import componentHandler from 'mdl-custom/material'

const tagAttrs =
`class="mdl-card mdl-shadow--2dp"`

riot.tag('mdl-card', tagHtml, tagAttrs, function (opts) {
  this.on('mount', () => {
    componentHandler.upgradeElement(this.root)
  })
})
