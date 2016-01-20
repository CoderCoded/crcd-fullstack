import { CALL_API } from 'redux-api-middleware'

const authMiddleware = ({getState, dispatch}) => next => action => {
  let token = getState().auth.token

  // Add header
  if (action[CALL_API] && token) {
    action[CALL_API].headers = {
      Authorization: 'Bearer ' + token,
      ...action[CALL_API].headers
    }
  }

  return next(action)
}

export default authMiddleware
