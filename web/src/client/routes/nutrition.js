// import nutrition, { fetchDataIfNeeded } from '../redux/modules/nutrition'
import '../components/pikaday'
import '../components/crcd-filter'
import { filterRows } from '../components/crcd-filter'
import '../mdl-components/mdl-textfield'
import '../mdl-components/mdl-data-table'
import tagHtml from './nutrition.html'

riot.tag('nutrition', tagHtml, function (opts) {
  this.log = log.child({childName: 'route/nutrition'})
  this.mixin('store')

  this.columns = [{
    name: 'Dessert (100g serving)',
    value: 'name',
    type: 'text'
  }, {
    name: 'Calories',
    value: 'calories',
    type: 'number'
  }, {
    name: 'Fat (g)',
    value: 'fat',
    type: 'number'
  }, {
    name: 'Carbs (g)',
    value: 'carbs',
    type: 'number'
  }, {
    name: 'Protein (g)',
    value: 'protein',
    type: 'number'
  }, {
    name: 'Sodium (mg)',
    value: 'sodium',
    type: 'number'
  }, {
    name: 'Calcium (%)',
    value: 'calcium',
    type: 'number'
  }, {
    name: 'Iron (%)',
    value: 'iron',
    type: 'number'
  }]

  // Dummy data, replace using redux
  this.rows = [{
    'name': 'Frozen yogurt',
    'calories': 159.0,
    'fat': 6.0,
    'carbs': 24.0,
    'protein': 4.0,
    'sodium': 87.0,
    'calcium': 14.0,
    'iron': 1.0
  }, {
    'name': 'Ice cream sandwich',
    'calories': 237.0,
    'fat': 9.0,
    'carbs': 37.0,
    'protein': 4.3,
    'sodium': 129.0,
    'calcium': 8.0,
    'iron': 1.0
  }, {
    'name': 'Eclair',
    'calories': 262.0,
    'fat': 16.0,
    'carbs': 24.0,
    'protein': 6.0,
    'sodium': 337.0,
    'calcium': 6.0,
    'iron': 7.0
  }, {
    'name': 'Cupcake',
    'calories': 305.0,
    'fat': 3.7,
    'carbs': 67.0,
    'protein': 4.3,
    'sodium': 413.0,
    'calcium': 3.0,
    'iron': 8.0
  }, {
    'name': 'Jelly bean',
    'calories': 375.0,
    'fat': 0.0,
    'carbs': 94.0,
    'protein': 0.0,
    'sodium': 50.0,
    'calcium': 0.0,
    'iron': 0.0
  }, {
    'name': 'Lollipop',
    'calories': 392.0,
    'fat': 0.2,
    'carbs': 98.0,
    'protein': 0.0,
    'sodium': 38.0,
    'calcium': 0.0,
    'iron': 2.0
  }, {
    'name': 'Honeycomb',
    'calories': 408.0,
    'fat': 3.2,
    'carbs': 87.0,
    'protein': 6.5,
    'sodium': 562.0,
    'calcium': 0.0,
    'iron': 45.0
  }, {
    'name': 'Donut',
    'calories': 452.0,
    'fat': 25.0,
    'carbs': 51.0,
    'protein': 4.9,
    'sodium': 326.0,
    'calcium': 2.0,
    'iron': 22.0
  }, {
    'name': 'KitKat',
    'calories': 518.0,
    'fat': 26.0,
    'carbs': 65.0,
    'protein': 7.0,
    'sodium': 54.0,
    'calcium': 12.0,
    'iron': 6.0
  }]

  this.filteredRows = this.rows

  this.on('mount', () => {
    this.log.debug('Mounted: <nutrition>')
    // this.store.registerReducers({ nutrition }, true)
    // this.store.dispatch(fetchDataIfNeeded())
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <nutrition>')
    // this.unsubscribe()
  })

  /* Filters
   * =======
   */
  this.filters = [{}]

  this.onFilterChange = (e) => {
    if (e instanceof window.Event) {
      // We don't want events here
      e.preventDefault()
      return false
    }
    let filter = e
    console.log('onFilterChange', filter)
    let changedFilter = this.filters.find(f => f.id === filter.id)
    let changedIdx = changedFilter ? this.filters.indexOf(changedFilter) : -1
    if (changedIdx < 0) {
      if (!filter.destroyed) {
        // Not found and not destroyed
        // console.log('Not found and not destroyed', changedIdx)
        let lastFilter = this.filters[this.filters.length - 1]
        Object.assign(lastFilter, filter)
        this.filters.push({})
      } else if (filter.destroyed) {
        // Not found and destroyed
        // console.log('Not found and destroyed', changedIdx)
      }
    } else {
      if (!filter.destroyed) {
        // Found and not destroyed
        // console.log('Found and not destroyed', changedIdx)
        let changedFilter = this.filters[changedIdx]
        Object.assign(changedFilter, filter)
      } else if (filter.destroyed) {
        // Found and destroyed
        // console.log('Found and destroyed', changedIdx)
        this.filters.splice(changedIdx, 1)
        if (this.filters.length < 1) this.filters.push({})
      }
    }
    this.filterRows()
    this.trigger('rowsUpdated', this.filteredRows)
    this.update()
  }

  this.filterRows = () => {
    this.log.debug('Filtering rows', this.rows.length)
    this.filteredRows = filterRows(this.rows, this.filters)
    this.log.debug('Filtered rows', this.filteredRows.length)
  }

  /* Store listener
   * ==============
   */
  // this.unsubscribe = this.store.subscribe(() => {
  //   let prevState = this.state
  //   this.state = this.store.getState().nutrition
  //   if (prevState !== this.state) {
  //     this.log.debug('State updated')
  //     this.update()
  //   }
  // })
})
