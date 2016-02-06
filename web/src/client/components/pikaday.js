import log from '../utils/log'
// import tagHtml from './pikaday.html'
// import './pikaday.scss'
// import componentHandler from 'mdl-custom/material'

import Pikaday from 'pikaday'
import './pikaday.scss'
import 'moment'

const tagHtml = '<yield></yield>'
const tagAttrs = ''

riot.tag('pikaday', tagHtml, tagAttrs, function (opts) {
  this.log = log.child('component/pikaday')

  this.on('updated', () => {
    if (!this.picker) {
      this.picker = new Pikaday({
        field: this.root.getElementsByTagName('input')[0],
        format: 'L',
        onSelect: this.onSelect
      })
    }
  })

  this.onSelect = () => {
    if (opts.onchange) opts.onchange(this.picker.getMoment())
  }
})
