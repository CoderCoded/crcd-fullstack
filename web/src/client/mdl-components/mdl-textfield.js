// This is 3rd party addition, no official mdl component
// https://github.com/CreativeIT/getmdl-select

import componentHandler from 'mdl-custom/material'

import tagHtml from './mdl-textfield.html'

const tagAttrs = 'class="mdl-textfield mdl-js-textfield { mdl-textfield--floating-label: opts.floatingLabel, is-dirty: opts.inputValue } { opts.classExt }"'

riot.tag('mdl-textfield', tagHtml, tagAttrs, function (opts) {
  /*
   * Pattern to use for input (error shown if doesnt match)
   */
  this.pattern = opts.pattern || opts.numeric ? '-?[0-9]*(\.[0-9]+)?' : null

  // this.on('mount', () => {

  // })

  // this.on('update', () => {

  // })

  this.on('updated', () => {
    componentHandler.upgradeElement(this.root)
  })

  this.onChange = (e) => {
    e.preventDefault()
    let val = e.target.valueAsNumber
    if (isNaN(val)) {
      val = e.target.value
      if (opts.numeric) val = parseInt(val, 10)
    }
    if (val != null) {
      if (opts.onchange) opts.onchange(val)
    }
    return false
  }
})
