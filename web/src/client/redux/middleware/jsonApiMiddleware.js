import { CALL_API } from 'redux-api-middleware'

export function apiReqMiddleware (dispatch) {
  return next => action => {
    let callApiAction = action[CALL_API]

    if (callApiAction) {
      // Add AJAX header
      callApiAction.headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        ...callApiAction.headers
      }
      // Transform body to JSON string
      let { body } = callApiAction
      if (body && typeof body !== 'string') {
        callApiAction.body = JSON.stringify(body)
      }
      // Send cookies
      callApiAction.credentials = 'same-origin'
    }

    return next(action)
  }
}

export function apiResMiddleware (dispatch) {
  return next => action => {
    let callApiAction = action[CALL_API]

    if (callApiAction && callApiAction.payload) {
      // Transform response
      let { payload } = callApiAction
      let { data } = payload
      if (data && typeof data !== 'object') {
        payload.data = {}
      }
    }

    return next(action)
  }
}
