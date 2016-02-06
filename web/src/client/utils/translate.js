import i18next from 'i18next'
import XHR from 'i18next-xhr-backend'

import store from '../store'

export function changeLanguage (lng) {
  return new Promise((resolve, reject) => {
    i18next.changeLanguage(lng, (err, t) => {
      if (err) {
        let oldLng = store.getState().preferences.lng
        i18next.changeLanguage(oldLng, (err2, t) => {
          if (err2) return reject(err2)
          return reject(err)
        })
      } else {
        // Update translator
        global.t = t
        return resolve(t)
      }
    })
  })
}

export default function createTranslator () {
  return new Promise((resolve, reject) => {
    i18next
      .use(XHR)
      .init({
        lng: store.getState().preferences.lng,
        fallbackLng: 'en',
        backend: {
          // path where resources get loaded from
          loadPath: '/locales/{{lng}}/{{ns}}.json',

          // path to post missing resources
          // addPath: 'locales/add/{{lng}}/{{ns}}',

          // your backend server supports multiloading
          // /locales/resources.json?lng=de+en&ns=ns1+ns2
          allowMultiLoading: false,

          // parse data after it has been fetched
          // in example use https://www.npmjs.com/package/json5
          // here it removes the letter a from the json (bad idea)
          // parse: function(data) { return data.replace(/a/g, ''); },

          // allow cross domain requests
          crossDomain: false

          // define a custom xhr function
          // can be used to support XDomainRequest in IE 8 and 9
          // ajax: function (url, options, callback, data) {}
        }
      }, (err, t) => {
        // Set translator
        global.t = t
        if (err) return reject(err)
        else return resolve(t)
      })
  })
}
