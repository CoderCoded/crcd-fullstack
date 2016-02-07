import tagHtml from './pure-button.html'

const tagAttrs =
`class="pure-button pure-button-primary
 { pure-button-disabled: opts.disabled }
 { opts.classExt }" onclick="{ onClick }"`

riot.tag('pure-button', tagHtml, tagAttrs, function (opts) {
  this.on('mount', () => {
  })
  this.on('updated', () => {
  })

  this.onClick = (e) => {
    console.log('pure-button clicked')
  }
})
