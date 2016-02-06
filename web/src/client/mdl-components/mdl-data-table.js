// import componentHandler from 'mdl-custom/material'
import log from '../utils/log'
import dialogPolyfill from 'dialog-polyfill'
// import { RIPPLE_ANIM_LENGTH } from '../utils/constants'
import './mdl-paging'

import tagHtml from './mdl-data-table.html'

const tagAttrs = ''

riot.tag('mdl-data-table', tagHtml, tagAttrs, function (opts) {
  this.log = this.log = log.child({childName: 'mdl-component/mdl-data-table'})
  this.columns = opts.columns
  this.sortCol = -1
  this.sort = 'asc'
  this.momentFormat = opts.momentFormat || 'L HH:mm'
  this.allRows = opts.rows
  this.rows = []
  this.rowsSelected = new Set()
  this.headerChecked = false
  this.updating = false
  this.pendingUpdate = false

  this.on('mount', () => {
    this.log.debug('Mounted.')
  })

  this.parent.on('rowsUpdated', (newRows) => {
    this.log.debug('rowsUpdated from parent')
    this.allRows = newRows
    this.rowsSelected.clear() // Reset selected
    // Need to sort?
    if (this.sortCol >= 0 && this.sort) {
      this.log.debug('Sorting by col', this.sortCol)
      this.sortBy(this.columns[this.sortCol].value, this.sort === 'asc')
    }
    this.updateRows()
  })

  this.on('update', () => {
    this.log.debug('Updating...')
    this.updating = true
    this.pendingUpdate = false
  })

  this.on('updated', () => {
    // Init dialogs
    if (!this.deleteDialog) {
      this.deleteDialog = this.root.querySelector('.delete-dialog')
      if (!this.deleteDialog.showModal) dialogPolyfill.registerDialog(this.deleteDialog)
    }
    if (!this.editDialog) {
      this.editDialog = this.root.querySelector('.edit-dialog')
      if (!this.editDialog.showModal) dialogPolyfill.registerDialog(this.editDialog)
    }
    if (!this.addDialog) {
      this.addDialog = this.root.querySelector('.add-dialog')
      if (!this.addDialog.showModal) dialogPolyfill.registerDialog(this.addDialog)
    }

    this.log.debug('Updated.')
    this.updating = false
    // Update again if new update was requested
    if (this.pendingUpdate) this.update()
  })

  this.updateRows = () => {
    this.log.debug('updateRows() called.')
    if (!this.allRows) {
      this.log.debug('No rows, can\'t update.')
      return
    }
    if (!this.paging) {
      this.log.debug('No paging, can\'t update.')
      return
    }
    this.log.debug('Paging beg, end:', this.paging.begin, this.paging.end)
    this.rows = this.allRows.slice(this.paging.begin, this.paging.end + 1)
    this.rowsSelected.clear()
    this.headerChecked = false
    this.log.debug('Rows updated:', this.rows.length)
    if (!this.updating) {
      this.log.debug('Not updating, update().')
      this.update()
    } else {
      this.log.debug('Updating, pendingUpdate = true.')
      this.pendingUpdate = true
    }
  }

  this.sortBy = (key, asc) => {
    this.log.debug('Sorting by', key, asc)
    this.allRows.sort(function (a, b) {
      let aVal = a[key]
      let bVal = b[key]
      if (aVal._isAMomentObject && bVal._isAMomentObject) {
        if (aVal.isAfter(bVal)) {
          return asc ? 1 : -1
        }
        if (aVal.isBefore(bVal)) {
          return asc ? -1 : 1
        }
        return 0
      } else {
        if (aVal > bVal) {
          return asc ? 1 : -1
        }
        if (aVal < bVal) {
          return asc ? -1 : 1
        }
        return 0
      }
    })
    this.updateRows()
  }

  this.on('pagingUpdated', (paging) => {
    this.log.debug('Paging updated.')
    this.paging = paging
    this.updateRows()
  })

  this.isSortedAsc = (i) => {
    return this.sortCol === i && this.sort === 'asc'
  }

  this.isSortedDesc = (i) => {
    return this.sortCol === i && this.sort === 'desc'
  }

  this.onHeaderClick = (e) => {
    this.log.debug('Header clicked:', e.item.i)
    let i = e.item.i
    if (i != null) {
      if (this.sortCol === i) {
        this.sort = this.sort === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortCol = i
      }
      this.sortBy(this.columns[this.sortCol].value, this.sort === 'asc')
    }
  }

  this.onHeaderCheck = (e) => {
    this.log.debug('Header check:', e.target.checked)
    let i, len
    if (e.target.checked) {
      this.headerChecked = true
      for (i = 0, len = this.rows.length; i < len; i++) {
        // this.boxes[i].MaterialCheckbox.check()
        this.rowsSelected.add(i)
      }
    } else {
      this.headerChecked = false
      for (i = 0, len = this.rows.length; i < len; i++) {
        // this.boxes[i].MaterialCheckbox.uncheck()
        this.rowsSelected.delete(i)
      }
    }
  }

  this.onRowSelect = (e) => {
    if (!opts.selectable) return
    this.log.debug('Row check:', e.item.i)
    let i = e.item.i
    if (i != null) {
      if (this.rowsSelected.has(i)) {
        this.rowsSelected.delete(i)
      } else {
        this.rowsSelected.add(i)
      }
    }
  }

  this.onDeleteClick = (e) => {
    if (this.deleteDialog) this.deleteDialog.showModal()
  }

  this.onDeleteDialogCloseClick = (e) => {
    if (this.deleteDialog) this.deleteDialog.close()
  }

  this.onEditClick = (e) => {
    if (this.editDialog) this.editDialog.showModal()
  }

  this.onEditDialogCloseClick = (e) => {
    if (this.editDialog) this.editDialog.close()
  }

  this.onAddClick = (e) => {
    if (this.addDialog) this.addDialog.showModal()
  }

  this.onAddDialogCloseClick = (e) => {
    if (this.addDialog) this.addDialog.close()
  }
})
