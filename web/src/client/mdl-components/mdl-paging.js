import componentHandler from 'mdl-custom/material'

// MDL doesn't have paging, this is a 3rd party contibution
// https://github.com/google/material-design-lite/issues/2019#issuecomment-168056305

// import '../mdl-custom/paging/paging' // CSS only component
import '../mdl-custom/paging/_paging.scss'

import tagHtml from './mdl-paging.html'

const tagAttrs = 'class="mdl-paging"'

riot.tag('mdl-paging', tagHtml, tagAttrs, function (opts) {
  this.pageSizes = opts.pageSizes || [5, 10, 15, 20, 25, 30, 50]
  this.pageSize = this.pageSizes[2]
  this.totalItems = opts.total || 100
  this.page = opts.page || 0
  this.totalPages = Math.ceil(this.totalItems / this.pageSize)
  this.updatePending = true // Send first update

  this.pageMenuOpen = false

  this.togglePageMenu = () => {
    this.pageMenuOpen = !this.pageMenuOpen
  }

  this.getFirstItem = () => {
    let firstItem = this.page * this.pageSize + 1
    if (firstItem > this.totalItems) firstItem = this.totalItems
    // console.log('firstItem', firstItem)
    return firstItem
  }

  this.getLastItem = () => {
    let lastItem = this.page * this.pageSize + this.pageSize
    if (lastItem > this.totalItems) lastItem = this.totalItems
    // console.log('lastItem', lastItem)
    return lastItem
  }

  this.getPages = () => {
    return Array.apply(null, {length: this.totalPages}).map(Number.call, Number)
  }

  this.onSelectPage = (e) => {
    let { pageOpt } = e.item
    if (pageOpt != null) {
      this.page = pageOpt
      this.updatePending = true
    }
  }

  this.prev = () => {
    this.page--
    if (this.page < 0) this.page = 0
    else this.updatePending = true
  }

  this.next = () => {
    this.page++
    if (this.page >= this.totalPages) this.page = this.totalPages - 1
    else this.updatePending = true
  }

  this.onSelectPageSize = (e) => {
    let size = e.item.size
    if (size != null) {
      this.pageSize = size
      this.page = 0 // Reset page
      this.updatePending = true
    }
  }

  this.on('mount', () => {
    componentHandler.upgradeDom()
  })
  this.on('update', () => {
    let prevTotalItems = this.totalItems
    let prevTotalPages = this.totalPages

    this.totalItems = opts.total || 100
    this.totalPages = Math.ceil(this.totalItems / this.pageSize)

    if (prevTotalPages !== this.totalPages || prevTotalItems !== this.totalItems) {
      this.updatePending = true
    }

    // Send updates to parent
    if (this.updatePending) {
      let { page, pageSize, totalPages } = this
      let begin = this.getFirstItem() - 1
      let end = this.getLastItem() - 1
      this.parent.trigger('pagingUpdated', {
        page,
        pageSize,
        totalPages,
        begin,
        end
      })
      this.updatePending = false
    }
  })
})
