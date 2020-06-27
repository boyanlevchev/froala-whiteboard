const resetReduxReducer = (state, action) => {
  //compute and return the new state
  if(state === undefined) {
    return null;
  }

  if (action.type === 'RESET_REDUX') {
    return action.payload;
  } else {
    return state;
  }
}

export default resetReduxReducer;
