import { CALL_API } from 'redux-api-middleware'
// import { Schema } from 'normalizr'

/* Action types
 * ------------
 */

const GET = 'crcd-web/roles/GET'
const GET_SUCCESS = 'crcd-web/roles/GET_SUCCESS'
const GET_FAIL = 'crcd-web/roles/GET_FAIL'

// const room = new Schema('rooms')

/* Action creators
 * ---------------
 */

export function fetchData () {
  return {
    [CALL_API]: {
      types: [GET, GET_SUCCESS, GET_FAIL],
      endpoint: `/api/roles/`,
      method: 'GET'
    }
  }
}

export function fetchDataIfNeeded () {
  return function (dispatch, getState) {
    return dispatch(fetchData())
  }
}

/* Reducer
 * -------
 */

export default function reducer (state = {}, action) {
  switch (action.type) {
    case GET:
      // console.log('Role get sent')
      return state
    case GET_SUCCESS:
      // console.log('Role get successful', action.meta)
      return {
        ...state,
        list: action.payload
      }
    case GET_FAIL:
      // console.log('Role get failed', action.error)
      return state
    default:
      return state
  }
}
