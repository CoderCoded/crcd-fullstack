// This is 3rd party addition, no official mdl component
// https://github.com/CreativeIT/getmdl-select

import componentHandler from 'mdl-custom/material'

import '../mdl-custom/getmdl-select/getmdl-select.scss'

import tagHtml from './mdl-select.html'

const tagAttrs = 'class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select { opts.classExt } { is-dirty: selectedItem.name }"'

riot.tag('mdl-select', tagHtml, tagAttrs, function (opts) {
  this.on('mount', () => {
  })
  this.on('update', () => {
    if (opts.resetOnUpdate && !opts.selectedItem) this.selectedItem = {}
  })

  this.on('updated', () => {
    componentHandler.upgradeElement(this.root)
    componentHandler.upgradeElement(this.root.querySelector('.mdl-js-menu'))
  })

  this.selectedItem = opts.selectedItem || {}

  this.onSelect = (e) => {
    let item = e.item
    if (item != null) {
      this.selectedItem = item
      // TODO: Maybe pass whole event instead of just item?
      if (opts.onchange) opts.onchange(item)
    }
  }
})
