const fetchUpdateReducer = (state, action) => {
  //compute and return the new state
  if(state === undefined) {
    return null;
  }

  if (action.type === 'FETCH_UPDATE') {
    return action.payload;
  } else {
    return state;
  }
}

export default fetchUpdateReducer;
