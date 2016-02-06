import componentHandler from 'mdl-custom/material'
// import i18next from 'i18next'
import { changeLanguage, toggleDebug } from '../redux/modules/preferences'

import '../mdl-components/mdl-select'

import './preferences.scss'
import tagHtml from './preferences.html'

riot.tag('preferences', tagHtml, function (opts) {
  this.mixin('store')
  this.log = log.child({childName: 'route/preferences'})
  // this.mixin('store')
  this.state = this.store.getState().preferences

  this.langOptions = [{
    name: 'English',
    value: 'en'
  }, {
    name: 'Suomi',
    value: 'fi'
  }, {
    name: 'Svenska',
    value: 'se'
  }]

  this.updateSelectedLang = () => {
    this.selectedLang = this.langOptions.find(item => item.value === this.state.lng)
  }
  this.updateSelectedLang()

  this.onLangSelect = (item) => {
    this.log.debug('Language selected:', item.value)
    let lng = item.value
    if (lng && lng !== this.state.lng) {
      this.store.dispatch(changeLanguage(lng))
    }
  }

  this.onDebugChange = (e) => {
    this.store.dispatch(toggleDebug())
  }

  // this.on('update', () => {
  // })

  this.on('mount', () => {
    componentHandler.upgradeDom()
    this.log.debug('Mounted: <preferences>')
    this.log.debug('currentLanguage: ' + this.state.lng)
  })

  this.on('unmount', () => {
    this.log.debug('Unmounted: <preferences>')
    this.unsubscribe()
  })

  this.unsubscribe = this.store.subscribe(() => {
    let prevState = this.state
    this.state = this.store.getState().preferences
    if (prevState !== this.state) {
      this.log.debug('State updated, updating view')
      if (!this.state.pendingLng) {
        this.updateSelectedLang()
      }
      this.update()
    }
  })
})
