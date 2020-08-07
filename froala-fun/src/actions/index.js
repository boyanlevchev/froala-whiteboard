import {database} from '../firebase'

// Checks if initial fetch from Firebase has already been performed
let initialDataLoaded = false;

// Passing through selected editor information
export function selectEditor(editor) {
  return {
    type: 'SELECT_EDITOR',
    payload: editor
  }
}

// Passing through which editor we want to drag
export function setDragging(editor) {
  return {
    type: 'SET_DRAGGING',
    payload: editor
  }
}

// Generally turns on draggability for all editors
export function setCanvasDraggable(boolean) {
  return {
    type: 'SET_CANVAS_DRAGGABLE',
    payload: boolean
  }
}

// Passes through a true or false if the button is active, which we need to be able to run some condition in another component
export function setDragnDropButtonActive(boolean) {
  return {
    type: 'DRAG_N_DROP_BUTTON_ACTIVE',
    payload: boolean
  }
}

// Passes a true/false, for whether you can draw on the whiteboard
export function setCanvasDrawable(boolean) {
  return {
    type: 'SET_CANVAS_DRAWABLE',
    payload: boolean
  }
}

// In some places where we sent updates to Firebae, we also wanted a local update - so we do this one
export function updateEditorLocally(editor) {
  return {
    type: 'UPDATE_EDITOR_LOCALLY',
    payload: editor
  }
};

// Passes through the reset whiteboard command from the buttons to the whiteboard parent
export function resetWhiteboard(boolean) {
  return {
    type: 'RESET_WHITEBOARD',
    payload: boolean
  }
}

// Passes through a true/false with which to reset all Redux props
export function resetRedux(boolean) {
  return {
    type: 'RESET_REDUX',
    payload: boolean
  }
}

// .....
// Firebase
// .....

// adds any new item in the Firebase (not just a new editor) - so can be a new drawing canvas, can be a information if the intro has been watched
export const addEditor = (newEditor) => async dispatch => {
  database.ref().update(newEditor);
  // database.ref(pathAndKey).set(newEditor);
  // console.log("this shit got called yo")
};

// Updates any already existing editors in Firebae
export const updateEditor = updateEditor => async dispatch => {
  database.ref().update(updateEditor);
  // console.log("this shit got updated yo")
};

// Deletes editor in Firebase
export const deleteEditor = deleteEditor => async dispatch => {
  database.ref().child(deleteEditor).remove(function(error){
    if (!error) {
      // console.log(`${deleteEditor} has been deleted online`)
      dispatch( {
        type: 'DELETE_EDITOR',
        payload: deleteEditor.split('/').pop()
      })
    } else {
      console.log("Something went wrong with deleting editor from firebase")
    }
  });
};

// The initial fetch upon loading the page
export const fetchEditors = (canvas) => async dispatch => {
  // console.log(`this is the canvas path: ${canvas}`)
  database.ref(canvas).once("value", snapshot => {
    // console.log("data fetched", snapshot.val())
    if (snapshot.val()) {
        dispatch({
        type: 'FETCH_EDITOR',
        payload: snapshot.val()
      });
    } else {
        dispatch({
        type: 'FETCH_EDITOR',
        payload: "Nothing to fetch"
      });
    }

    initialDataLoaded = true;
  });
};

// Check for updates on items in Firebase (so if another user adds something, it will be fetched as an update here)
export const fetchUpdates = (canvas) => async dispatch => {

  // Check if update consists of an item being added
  database.ref(canvas).on("child_added", function(data) {
    if (initialDataLoaded) {
      // console.log("child added", data.key, data.val())
      dispatch({
        type: 'FETCH_UPDATE',
        payload: {key: data.key, val: data.val()}
      });
    }
  });

  // Check if update consists of an item being added in the editors subdirectory
  database.ref(`${canvas}/editors`).on("child_added", function(data) {
    if (initialDataLoaded) {
      // console.log("child editor added", data.key, data.val())
      dispatch({
        type: 'FETCH_UPDATE',
        payload: {editors: {key: data.key, val: data.val()}}
      });
    }
  });

  // Check if update consists of an item being changed
  database.ref(canvas).on("child_changed", function(data) {
    if (data.key !== "editors") {
      // console.log("child changed", data.key)
      dispatch({
        type: 'FETCH_UPDATE',
        payload: {key: data.key, val: data.val()}
      });
    }
  });

  // Check if update consists of an item being changed in editors subidrectory
  database.ref(`${canvas}/editors`).on("child_changed", function(data) {
    // console.log(canvas, "ref")
    // console.log("child changed", data.key)
    dispatch({
      type: 'FETCH_UPDATE',
      payload: {editors: {key: data.key, val: data.val()}}
    });
  });

  // Check if update consists of an item being removed
  database.ref(`${canvas}/editors`).on("child_removed", function(data) {
    // console.log("child removed")
    dispatch({
      type: 'FETCH_UPDATE',
      payload: {childDeleted: {key: data.key, val: data.val()}}
    });
  });
};

