const setCanvasDrawable = (state, action) => {
  //compute and return the new state
  if(state === undefined) {
    return false;
  }

  if (action.type === 'SET_CANVAS_DRAWABLE') {
    return action.payload;
  } else {
    return state;
  }
}

export default setCanvasDrawable;
