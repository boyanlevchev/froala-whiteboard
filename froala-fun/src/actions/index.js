import {database} from '../firebase'

let initialDataLoaded = false;

export function selectEditor(editor) {
  return {
    type: 'SELECT_EDITOR',
    payload: editor
  }
}

export function setDragging(editor) {
  return {
    type: 'SET_DRAGGING',
    payload: editor
  }
}

export function setCanvasDraggable(boolean) {
  return {
    type: 'SET_CANVAS_DRAGGABLE',
    payload: boolean
  }
}

export const addEditor = (newEditor) => async dispatch => {
  database.ref().update(newEditor);
  // database.ref(pathAndKey).set(newEditor);
  // console.log("this shit got called yo")
};

export const updateEditor = updateEditor => async dispatch => {
  database.ref().update(updateEditor);
  // console.log("this shit got updated yo")
};

export const deleteEditor = deleteEditor => async dispatch => {
  database.ref().child(deleteEditor).remove(function(error){
    if (!error) {
      console.log(`${deleteEditor} has been deleted online`)
      dispatch( {
        type: 'DELETE_EDITOR',
        payload: deleteEditor.split('/').pop()
      })
    } else {
      console.log("Something went wrong with deleting editor from firebase")
    }
  });
};

export const fetchEditors = (canvas) => async dispatch => {
  console.log(`this is the canvas path: ${canvas}`)
  database.ref(canvas).once("value", snapshot => {
    console.log("data fetched")
    dispatch({
      type: 'FETCH_EDITOR',
      payload: snapshot.val()
    });
    initialDataLoaded = true;
  });
};

export const fetchUpdates = (canvas) => async dispatch => {
  // console.log(`this is the canvas path: ${canvas}`)
  database.ref(canvas).on("child_added", function(data) {
    if (initialDataLoaded) {
      console.log("child added")
      dispatch({
        type: 'FETCH_UPDATE',
        payload: {key: data.key, val: data.val()}
      });
    }
  });
  database.ref(canvas).on("child_changed", function(data) {
    console.log("child changed")
    dispatch({
      type: 'FETCH_UPDATE',
      payload: {key: data.key, val: data.val()}
    });
  });
  database.ref(canvas).on("child_removed", function(data) {
    // console.log("child removed")
    dispatch({
      type: 'FETCH_UPDATE',
      payload: {key: data.key, val: data.val()}
    });
  });
};

