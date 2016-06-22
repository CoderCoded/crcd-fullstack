import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { apiMiddleware } from 'redux-api-middleware'
import persistState from 'redux-localstorage'
import authMiddleware from './middleware/authMiddleware'
import { apiReqMiddleware, apiResMiddleware } from './middleware/jsonApiMiddleware'
import thunk from 'redux-thunk'

import log from '../utils/log'

import auth from './modules/auth'
import app from './modules/app'
import preferences from './modules/preferences'

let store = null
let initialReducers = { auth, app, preferences }

/**
 * Creates a redux store with middleware and reducers using an initial state
 * @param  {object} initialState - Initial state for the store
 * @return {object} store - The created store
 */
export default function createReduxStore (initialState) {
  let createStoreWithMiddleware

  createStoreWithMiddleware = compose(
    persistState('preferences'),
    applyMiddleware(
      thunk,
      authMiddleware,
      apiReqMiddleware,
      apiMiddleware,
      apiResMiddleware
    )
  )(createStore)

  // Don't pass extra data since Redux throws an error, each reducer handles their initialState
  store = createStoreWithMiddleware(combineReducers(initialReducers), {
    auth: initialState.auth || {},
    app: initialState.app || {},
    preferences: initialState.preferences || {}
  })

  store._reducers = initialReducers

  /**
   * Register new reducers to the store.
   * @param  {object} newReducers - Reducers to add
   */
  store.registerReducers = (newReducers, update) => {
    store._reducers = { ...store._reducers, ...newReducers }
    if (update) store.updateReducers()
  }

  /**
   * Reset store reducers to initial (for logouts etc).
   */
  store.resetReducers = () => {
    store._reducers = initialReducers
    store.replaceReducer(combineReducers(store._reducers))
  }

  /**
   * Updates the store after new reducers are registered.
   */
  store.updateReducers = () => {
    store.replaceReducer(combineReducers(store._reducers))
  }

  store.log = log.child({childName: 'store'})

  store.log.info('Store created.')

  return store
}
