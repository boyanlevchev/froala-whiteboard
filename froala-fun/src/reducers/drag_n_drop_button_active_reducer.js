const dragnDropButtonActive = (state, action) => {
  //compute and return the new state
  if(state === undefined) {
    return false;
  }

  if (action.type === 'DRAG_N_DROP_BUTTON_ACTIVE') {
    return action.payload;
  } else {
    return state;
  }
}

export default dragnDropButtonActive;
