import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {devTools, persistState} from 'redux-devtools';
import * as reducers from '../reducers/index';
import {socket} from '../utils/socket';

let createStoreWithMiddleware;

// Configure the dev tools when in DEV mode
if (__DEV__) {
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware),
    devTools(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
}

const rootReducer = combineReducers(reducers);

export default function configureStore(initialState) {
  var store = createStoreWithMiddleware(rootReducer, initialState);

  socket.on('gameAction', (action, callback) => {
  	console.log('action from remote', action, callback);
  	store.dispatch(action);
    if ( callback ) callback();
  });

  return store;
}
