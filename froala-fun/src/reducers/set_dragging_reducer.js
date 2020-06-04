const setDraggingReducer = (state, action) => {
  //compute and return the new state
  if(state === undefined) {
    return null;
  }

  if (action.type === 'SET_DRAGGING') {
    return action.payload;
  } else {
    return state;
  }
}

export default setDraggingReducer;
