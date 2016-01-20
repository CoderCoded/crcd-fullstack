import { CALL_API } from 'redux-api-middleware'

import log from '../../utils/log'

const authlog = log.child({childName: 'redux/auth'})

/* Action types
 * ------------
 */

const GET = 'crcd-web/auth/GET'
const GET_SUCCESS = 'crcd-web/auth/GET_SUCCESS'
const GET_FAIL = 'crcd-web/auth/GET_FAIL'

const LOGIN = 'crcd-web/auth/LOGIN'
const LOGIN_SUCCESS = 'crcd-web/auth/LOGIN_SUCCESS'
const LOGIN_FAIL = 'crcd-web/auth/LOGIN_FAIL'

const LOGOUT = 'crcd-web/auth/LOGOUT'
const LOGOUT_SUCCESS = 'crcd-web/auth/LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'crcd-web/auth/LOGOUT_FAIL'

/* Action creators
 * ---------------
 */

export function fetchData () {
  // console.log('ACTION: ', GET)
  return {
    [CALL_API]: {
      types: [GET, GET_SUCCESS, GET_FAIL],
      endpoint: '/',
      method: 'GET'
    }
  }
}

export function fetchDataIfNeeded () {
  return (dispatch, getState) => {
    if (getState().auth.user != null) return
    return dispatch(fetchData())
  }
}

export function login (username, password) {
  return {
    [CALL_API]: {
      types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
      endpoint: '/login',
      method: 'POST',
      body: {
        username,
        password
      }
    }
  }
}

export function logout () {
  return {
    [CALL_API]: {
      types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
      endpoint: '/logout',
      method: 'GET'
    }
  }
}

/* Reducer
 * ------
 */

export default function reducer (state = {}, action) {
  switch (action.type) {
    case GET:
      // console.log('User get sent')
      return state
    case GET_SUCCESS:
      // console.log('User get successful', action.meta)
      return {
        ...state,
        user: action.payload.data.user
      }
    case GET_FAIL:
      // console.log('User get failed', action.meta)
      return state
    case LOGIN:
      // console.log('Login sent')
      return state
    case LOGIN_SUCCESS:
      let { redirectTo, user } = action.payload.data
      authlog.info('Login successful, user:', user.username)
      if (redirectTo) authlog.debug('Redirecting:', redirectTo)
      return {
        ...state,
        user,
        redirectTo
      }
    case LOGIN_FAIL:
      authlog.error('Login failed.', action.meta)
      return state
    case LOGOUT:
      authlog.debug('Logout sent.')
      return state
    case LOGOUT_SUCCESS:
      authlog.info('Logout successful.')
      delete state['user']
      return {
        ...state,
        redirectTo: '/login'
      }
    case LOGOUT_FAIL:
      authlog.error('Logout failed.', action.meta)
      return state
    default:
      return state
  }
}
