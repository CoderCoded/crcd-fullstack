/**
 * Global state for the application
 * This module gets location from riot-route
 */

/* Action types
 * ------------
 */

const LOCATION_CHANGE = 'crcd-web/app/LOCATION_CHANGE'
const LOADING_START = 'crcd-web/app/LOADING_START'
const LOADING_STOP = 'crcd-web/app/LOADING_STOP'

/* Action creators
 * ---------------
 */

export function locationChange (path) {
  return {
    type: LOCATION_CHANGE,
    path
  }
}

export function startLoading () {
  return {
    type: LOADING_START
  }
}

export function stopLoading () {
  return {
    type: LOADING_STOP
  }
}

/* Reducer
 * ------
 */

let initialState = window.__data.app

initialState = {
  ...initialState,
  loading: true
}

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      let { path } = action
      switch (path) {
        case 'login':
          return {
            ...state,
            path,
            title: 'Login'
          }
        case 'logout':
          return {
            ...state,
            path,
            title: 'Logout'
          }
        case '':
          return {
            ...state,
            path,
            title: 'Dashboard'
          }
        case 'preferences':
          return {
            ...state,
            path,
            title: 'Preferences'
          }
        default:
          return {
            ...state,
            path,
            title: 'Not Found'
          }
      }
      break
    case LOADING_START:
      return {
        ...state,
        loading: true
      }
    case LOADING_STOP:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
