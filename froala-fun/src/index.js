import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


import selectedEditorReducer from './reducers/selected_editor_reducer'
import setDraggingReducer from './reducers/set_dragging_reducer'
import setCanvasDraggable from './reducers/set_canvas_draggable_reducer'
import dragnDropButtonActive from './reducers/drag_n_drop_button_active_reducer'
import setCanvasDrawable from './reducers/set_canvas_drawable_reducer'
import fetchEditorReducer from './reducers/fetch_editor_reducer'
import deleteEditorReducer from './reducers/delete_editor_reducer'
import fetchUpdateReducer from './reducers/fetch_update_reducer'
import updateEditorLocallyReducer from './reducers/update_editor_locally_reducer'

// Redux reducers are combined to be passed into story
const appReducer = combineReducers({
  selectedEditor: selectedEditorReducer,
  draggableEditor: setDraggingReducer,
  canvasDraggable: setCanvasDraggable,
  dragnDropButtonActive: dragnDropButtonActive,
  canvasDrawable: setCanvasDrawable,
  fetchedEditors: fetchEditorReducer,
  deletedEditorId: deleteEditorReducer,
  fetchedUpdate: fetchUpdateReducer,
  localUpdatedEditor: updateEditorLocallyReducer
});

const reducers = (state, action) => {
  //this allows us to reset the Redux store when a whiteboard is cleared, thus allowing us to start with a clean slate
  if (action.type === 'RESET_REDUX') {
    state = undefined
    console.log("reset reducers", action.payload)
  }
  return appReducer(state, action)
}

// Below we render the app and wrap it in Redux provider
ReactDOM.render(
  <Provider store={createStore(reducers, {}, applyMiddleware(reduxThunk))}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
