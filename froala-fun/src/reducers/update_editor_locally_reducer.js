
const updateEditorLocallyReducer = (state, action) => {
  //compute and return the new state
  if(state === undefined) {
    return null;
  }

  if (action.type === 'UPDATE_EDITOR_LOCALLY') {
    return action.payload;
  } else {
    return state;
  }
}

export default updateEditorLocallyReducer;
