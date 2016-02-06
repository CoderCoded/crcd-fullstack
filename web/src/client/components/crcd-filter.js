import shortid from 'shortid'
import moment from 'moment'
import log from '../utils/log'
import '../mdl-components/mdl-button'
// import '../mdl-components/mdl-card'
import '../mdl-components/mdl-select'
import '../mdl-components/mdl-textfield'
import tagHtml from './crcd-filter.html'
import './crcd-filter.scss'
// import componentHandler from 'mdl-custom/material'

const tagAttrs =
`class="crcd-filter"`

riot.tag('crcd-filter', tagHtml, tagAttrs, function (opts) {
  this.log = log.child('component/crcd-filter')
  this.fields = opts.fields

  // console.log(`crcd-filter ${opts.state.id} state`, opts.state)

  this.state = {
    ...opts.state,
    id: opts.state.id || shortid.generate()
  }

  /**
   * Field select
   * ============
   */

  // this.state.fieldSelected = opts.state.fieldSelected

  this.onFieldSelect = (item) => {
    let shouldTriggerChange = !!this.state.fieldSelected
    this.state.fieldSelected = item
    console.log('onFieldSelect', item)
    // Default to 'today'
    if (item.type === 'date') {
      this.state.dateComparator = this.dateComparators.find(comp => comp.value === 'at')
      this.state.date = moment().startOf('day')
      shouldTriggerChange = true
    }
    if (shouldTriggerChange) this.triggerChange()
    else this.update()
  }

  /**
   * Search
   * ======
   */

  this.hasSearch = () => {
    return this.state.fieldSelected && this.state.fieldSelected.type === 'text'
  }
  this.onSearch = (query) => {
    if (query instanceof window.Event) {
      // We don't want events here
      query.preventDefault()
      return false
    }
    this.state.query = query
    console.log('onSearch', query)
    this.triggerChange()
    this.update()
  }

  /**
   * Comparator select
   * =================
   */

  this.hasComparatorSelect = () => {
    return this.state.fieldSelected && this.state.fieldSelected.type === 'number'
  }
  this.comparators = [{
    name: 'Greater than',
    translateKey: 'filter.numberComparator.gt',
    value: 'gt'
  }, {
    name: 'Less than',
    translateKey: 'filter.numberComparator.lt',
    value: 'lt'
  }, {
    name: 'Equal',
    translateKey: 'filter.numberComparator.eq',
    value: 'eq'
  }]
  this.onComparatorSelect = (item) => {
    let shouldTriggerChange = !!this.state.comparator
    this.state.comparator = item
    console.log('onComparatorSelect', item)
    if (shouldTriggerChange) this.triggerChange()
    else this.update()
  }

  /**
   * Value select
   * ============
   */

  this.hasValueInput = () => {
    // return this.state.comparator
    return this.hasComparatorSelect()
  }
  this.onValueChange = (val) => {
    if (val instanceof window.Event) {
      // We don't want events here
      val.preventDefault()
      return false
    }
    this.state.value = val
    console.log('onValueChange', val)
    this.triggerChange()
    this.update()
  }

  /**
   * Date comparator select
   * ======================
   */

  this.hasDateComparatorSelect = () => {
    return this.state.fieldSelected && this.state.fieldSelected.type === 'date'
  }
  this.dateComparators = [{
    name: 'After',
    translateKey: 'filter.dateComparator.after',
    value: 'after'
  }, {
    name: 'Before',
    translateKey: 'filter.dateComparator.before',
    value: 'before'
  }, {
    name: 'At',
    translateKey: 'filter.dateComparator.at',
    value: 'at'
  }]
  this.onDateComparatorSelect = (item) => {
    let shouldTriggerChange = !!this.state.dateComparator
    this.state.dateComparator = item
    console.log('onDateComparatorSelect', item)
    if (shouldTriggerChange) this.triggerChange()
    else this.update()
  }

  /**
   * Date select
   * ===========
   */

  this.hasDateInput = () => {
    return this.state.dateComparator
  }
  this.onDateChange = (date) => {
    if (date instanceof window.Event) {
      // We don't want events here
      date.preventDefault()
      return false
    }
    console.log('onDateChange', date)
    this.state.date = date
    this.triggerChange()
    this.update()
  }

  this.triggerChange = () => {
    if (opts.onchange) {
      opts.onchange(this.state)
    }
  }

  this.reset = () => {
    this.state.fieldSelected = null
    this.state.comparator = null
    this.state.dateComparator = null
    this.state.query = null
    this.state.value = null
    this.state.date = null
    this.triggerChange()
    this.update()
  }

  this.close = () => {
    this.state.destroyed = true
    this.reset()
  }
})

/**
 * Filter data rows by given filters
 * @param  {Array} rows    Rows to filter
 * @param  {Array} filters Filters (TODO: create class for filters)
 * @return {Array}         Filtered rows
 */
export function filterRows (rows, filters) {
  return rows.filter((row) => {
    let keepRow = filters.every((filter) => {
      let { fieldSelected, comparator, value, query, dateComparator, date } = filter
      // Field must be selected
      if (!fieldSelected) return true
      // Text field needs query string
      if (fieldSelected.type === 'text' && !query) return true
      // Number field needs comparator
      if (fieldSelected.type === 'number' && !comparator) return true
      // Date field needs date comparator
      if (fieldSelected.type === 'date' && !dateComparator) return true
      // Comparator needs value
      if (comparator && value == null) return true
      // Date comparator needs date
      if (dateComparator && !date) return true

      let fieldValue = row[fieldSelected.value]
      if (!fieldValue) return true

      switch (fieldSelected.type) {
        case 'text':
          return fieldValue.toLowerCase().includes(query.toLowerCase())
        case 'date':
          if (dateComparator.value === 'after') {
            if (fieldValue.isAfter(date)) return true
            else return false
          } else if (dateComparator.value === 'before') {
            if (fieldValue.isBefore(date)) return true
            else return false
          } else /* 'at' */{
            // .isSame() is quite useless, so we use tomorrow here
            // if (fieldValue.isSame(date)) return true
            let tomorrow = moment(date).add(1, 'day')
            if (fieldValue.isBetween(date, tomorrow)) return true
            else return false
          }
          return true
        case 'number':
          if (comparator.value === 'gt') {
            if (fieldValue > value) return true
            else return false
          } else if (comparator.value === 'lt') {
            if (fieldValue < value) return true
            else return false
          } else /* 'eq' */{
            if (fieldValue === value) return true
            else return false
          }
          return true
        default:
          // Type not supported
          return true
      }
    })
    return keepRow
  })
}
