import tagHtml from './mdl-button.html'
import componentHandler from 'mdl-custom/material'

const tagAttrs =
`class="mdl-button mdl-js-button mdl-js-ripple-effect {
  mdl-button--fab: opts.fab,
  mdl-button--raised: opts.raised,
  mdl-button--colored: opts.colored,
  mdl-button--accent: opts.accent,
  mdl-button--icon: opts.icon && !opts.fab,
  mdl-button--mini-fab: opts.mini
} { opts.classExt }"
  __disabled="{ opts.disabled }"`

riot.tag('mdl-button', tagHtml, tagAttrs, function (opts) {
  this.on('mount', () => {
    componentHandler.upgradeElement(this.root)
    if (opts.tooltip) {
      let tooltipEl = document.createElement('div')
      tooltipEl.setAttribute('class', 'mdl-tooltip')
      tooltipEl.setAttribute('for', opts.id)
      tooltipEl.textContent = opts.tooltip
      console.log('Adding tooltip to', this.root.parentNode)
      this.root.parentNode.appendChild(tooltipEl)
      componentHandler.upgradeElement(tooltipEl)
      this.tooltipEl = tooltipEl
    }
  })
  this.on('updated', () => {

  })

  this.on('before-unmount', () => {
    if (this.tooltipEl) this.root.parentNode.removeChild(this.tooltipEl)
  })
})
