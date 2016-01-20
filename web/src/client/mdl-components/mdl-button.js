import tagHtml from './mdl-button.html'
import componentHandler from 'material-design-lite/material'

const tagAttrs = 'class="mdl-button mdl-js-button mdl-js-ripple-effect { mdl-button--icon: opts.icon }"'

riot.tag('mdl-button', tagHtml, tagAttrs, function (opts) {
  this.on('mount', () => {
    // firstChild is assumed to be the <button>
    componentHandler.upgradeElement(this.root.firstChild)
  })
})
