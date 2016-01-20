import { CALL_API } from 'redux-api-middleware'
// import { Schema } from 'normalizr'

/* Action types
 * ------------
 */

const GET = 'crcd-web/objects/GET'
const GET_SUCCESS = 'crcd-web/objects/GET_SUCCESS'
const GET_FAIL = 'crcd-web/objects/GET_FAIL'

// const room = new Schema('rooms')

/* Action creators
 * ---------------
 */

export function fetchData () {
  // console.log('ACTION: ', GET)
  return {
    [CALL_API]: {
      types: [GET, GET_SUCCESS, GET_FAIL],
      endpoint: `/api/objects/`,
      method: 'GET'
    }
  }
}

export function fetchDataIfNeeded () {
  return function (dispatch, getState) {
    // TODO: Check here if we alread have the data
    return dispatch(fetchData())
  }
}

/* Reducer
 * ------
 */

export default function reducer (state = {}, action) {
  switch (action.type) {
    case GET:
      // console.log('Object get sent')
      return state
    case GET_SUCCESS:
      // console.log('Object get successful', action.meta)
      return {
        ...state,
        list: action.payload
      }
    case GET_FAIL:
      // console.log('Object get failed', action.meta)
      return state
    default:
      return state
  }
}
