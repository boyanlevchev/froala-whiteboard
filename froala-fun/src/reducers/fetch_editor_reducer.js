// import {FETCH_TODOS} from '../actions/types';

// export default (state, action) => {
//   switch(action.type) {
//     case FETCH_TODOS:
//       return action.payload;
//     default:
//       return state;
//   }
// };

const fetchEditorReducer = (state, action) => {
  //compute and return the new state
  if(state === undefined) {
    return null;
  }

  if (action.type === 'FETCH_EDITOR') {
    return action.payload;
  } else {
    return state;
  }
}

export default fetchEditorReducer;
