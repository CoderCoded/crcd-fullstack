import { CALL_API } from 'redux-api-middleware'

import log from '../../utils/log'

const preflog = log.child({childName: 'redux/preferences'})

/* Action types
 * ------------
 */

const GET = 'crcd-web/preferences/GET'
const GET_SUCCESS = 'crcd-web/preferences/GET_SUCCESS'
const GET_FAIL = 'crcd-web/preferences/GET_FAIL'

// const UPDATE = 'crcd-web/preferences/UPDATE'
// const UPDATE_SUCCESS = 'crcd-web/preferences/UPDATE_SUCCESS'
// const UPDATE_FAIL = 'crcd-web/preferences/UPDATE_FAIL'

const CHANGE_LANG = 'crcd-web/preferences/CHANGE_LANG'
const CHANGE_LANG_SUCCESS = 'crcd-web/preferences/CHANGE_LANG_SUCCESS'
const CHANGE_LANG_FAIL = 'crcd-web/preferences/CHANGE_LANG_FAIL'

const TOGGLE_DEBUG = 'crcd-web/preferences/TOGGLE_DEBUG'

// const room = new Schema('rooms')

/* Action creators
 * ---------------
 */

export function changeLanguage (lng) {
  return {
    type: CHANGE_LANG,
    lng
  }
}

export function changeLanguageSuccess () {
  return {
    type: CHANGE_LANG_SUCCESS
  }
}

export function changeLanguageFail (err) {
  return {
    type: CHANGE_LANG_FAIL,
    payload: err
  }
}

export function fetchData () {
  return {
    [CALL_API]: {
      types: [GET, GET_SUCCESS, GET_FAIL],
      endpoint: '/preferences/',
      method: 'GET'
    }
  }
}

export function fetchDataIfNeeded () {
  return (dispatch, getState) => {
    if (getState().preferences.list != null) return
    return dispatch(fetchData())
  }
}

export function toggleDebug () {
  return {
    type: TOGGLE_DEBUG
  }
}

/* Reducer
 * ------
 */

let initialState = window.__data.preferences

if (!initialState) initialState = {}

initialState = {
  ...initialState,
  lng: initialState.lng || 'en',
  debug: initialState.debug || false
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case GET:
      preflog.debug('Preferences get sent')
      return state
    case GET_SUCCESS:
      preflog.debug('Preferences get successful', action.payload)
      return state
    case GET_FAIL:
      preflog.error('Preferences get failed', action.payload)
      return state
    case CHANGE_LANG:
      preflog.info('Language change requested', action.lng)
      return {
        ...state,
        pendingLng: action.lng
      }
    case CHANGE_LANG_SUCCESS:
      let lng = state.pendingLng
      preflog.info('Language change success', lng)
      delete state.pendingLng
      return {
        ...state,
        lng
      }
    case CHANGE_LANG_FAIL:
      preflog.error('Language change failed:', action.payload)
      delete state.pendingLng
      return {
        ...state
      }
    case TOGGLE_DEBUG:
      preflog.info('Toggling debug mode', !state.debug)
      return {
        ...state,
        debug: !state.debug
      }
    default:
      return state
  }
}
