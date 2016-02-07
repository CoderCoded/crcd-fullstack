import { CALL_API } from 'redux-api-middleware'

import log from '../../utils/log'

const preflog = log.child({childName: 'redux/preferences'})

/* Action types
 * ------------
 */

const GET = 'crcd-web/preferences/GET'
const GET_SUCCESS = 'crcd-web/preferences/GET_SUCCESS'
const GET_FAIL = 'crcd-web/preferences/GET_FAIL'

const TOGGLE_DEBUG = 'crcd-web/preferences/TOGGLE_DEBUG'

/* Action creators
 * ---------------
 */

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
