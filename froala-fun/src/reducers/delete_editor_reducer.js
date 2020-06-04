
const deleteEditorReducer = (state, action) => {
  //compute and return the new state
  if(state === undefined) {
    return null;
  }

  if (action.type === 'DELETE_EDITOR') {
    return action.payload;
  } else {
    return state;
  }
}

export default deleteEditorReducer;
