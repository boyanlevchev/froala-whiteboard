import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { selectEditor, setDragging, setCanvasDraggable, addEditor, updateEditor, fetchEditors, fetchUpdates, deleteEditor, resetRedux } from '../actions'

import Editor from '../components/froala'
import Controls from '../components/controls'
import Intro from '../components/intro'
import {SketchField, Tools} from 'react-sketch';

class Canvas extends Component {
  constructor(props) {
    super(props);

    // Below we set the initial Redux prop for setCanvasDraggable to false.
    // This means that no items on the whiteboard can be dragged (this is toggled later by pressing 'CMD' button)
    this.props.setCanvasDraggable(false);

    //We create a React ref to the sketchfield, which allows us to capture the initial instance of the sketchfield to manipulate
    this.sketchField = React.createRef();
    this.eraserField = React.createRef();

    this.state = {
      firstClick: 0,
      editorComponents: {},
      editorIDs: 0,
      drawable: false,
      erasable: false,
      currentSketchField: "",
      lastRef: [],
      fetchedSketchfield: {},
      initialFetch: false,
      clearingBoard: false,
      secondClick: {},
      styling: "",
      fadeLoader: false,
      loaderFaded: false,
      tutorialFinished: false,
      fadeIntro: false,
      introFaded: false
    };
  }

  componentDidMount() {
    //we create a nice looking variable of the whiteboard ID, which we will use as a filepath in S3 and Firebase
    const path = this.props.path.replace('/','')

    //When component mounts, we make a call to the backend to retrieve a signature for communicating with S3
    fetch(`/wysiwyg-editor/whiteboard/api/get_signature/${path}`).then(res => res.json()).then( res => {
      this.setState({secondClick: res})
    })

    fetch('/wysiwyg-editor/whiteboard/api/get_frofro').then(res => res.text()).then( res => {
      this.setState({styling: res})
    })

    //When component mounts, we make call the Redux function that retrieves items in database and begins to listen for changes
    this.props.fetchEditors(this.props.path.substring(1))
    this.props.fetchUpdates(this.props.path.substring(1))
  }

  // A lot of confusing if statements below which essentially redirect prop and state cahnges to the correct place
  // In addition to redirecting retrieved information from the database
  // Might be better to rewrite these as UseEffect react hooks, so as to listen for specific prop and state changes
  componentDidUpdate(prevProps) {
    // if (this.props.fetchedEditors) {
    //   console.log("fetched editors",this.props.fetchedEditors)
    // }

    if (this.props.localUpdatedEditor && (prevProps.localUpdatedEditor !== this.props.localUpdatedEditor)) {

      const key = Object.keys(this.props.localUpdatedEditor)[0]
      // console.log("locally updated shiz", this.props.localUpdatedEditor[key]['html'])
      const x = this.state.editorComponents[key]['x']
      const y = this.state.editorComponents[key]['y']
      const html = this.props.localUpdatedEditor[key]['html']
      this.setState(prevState => ({
            editorComponents: {
                ...prevState.editorComponents,
                [key]: {html: html, x: x, y: y}
            }
          }))
    }

    //intial Fetch
    if (this.props.fetchedEditors
      && this.state.editorComponents
      && this.state.fetchedSketchfield
      && (Object.keys(this.state.editorComponents).length === 0 && Object.keys(this.state.fetchedSketchfield).length === 0)
      && this.state.initialFetch === false) {

      // console.log("fetched")
      // console.log(this.props.fetchedEditors, "fetched editors")
      // const { sketchfield, ...nonSketchfield } = this.props.fetchedEditors; //(would be good to remember this trick - good for "popping" key/values from objects - really just creates a new object with ...item, and a lone item from the item on the left) Is not necessary anymore for purposes
      const sketchfield = (this.props.fetchedEditors.sketchfield ? this.props.fetchedEditors.sketchfield : {});
      const editorID = (this.props.fetchedEditors.editorID ? this.props.fetchedEditors.editorID : 0 )
      const editors = (this.props.fetchedEditors.editors ? this.props.fetchedEditors.editors : {})
      const lastRef = (this.props.fetchedEditors.sketchfield ? JSON.parse(sketchfield).objects : [])
      const tutorialFinished = (this.props.fetchedEditors.tutorialFinished ? this.props.fetchedEditors.tutorialFinished : false)
        this.setState({
          editorIDs: editorID,
          editorComponents: editors,
          fetchedSketchfield: sketchfield,
          lastRef: lastRef,
          initialFetch: true,
          tutorialFinished: tutorialFinished
        })
    }

    //Delete editor from screen
    if (this.props.deletedEditorId in this.state.editorComponents) {

      this.handleDelete();
    }

    //Fetch updates
    if (prevProps.fetchedUpdate !== this.props.fetchedUpdate && this.props.fetchedUpdate !== null ) {


      if (!this.props.fetchedUpdate.childDeleted) {
        const key = this.props.fetchedUpdate.key;

        //updates the sketchfield with other users' updates
        if (key === "sketchfield") {
          this.setState(prevState => ({
            fetchedSketchfield: this.props.fetchedUpdate.val,
            currentSketchField: this.props.fetchedUpdate.val,
            lastRef: JSON.parse(this.props.fetchedUpdate.val).objects
          }))

        //this one updates the the editor ID locally, and ensures that every session will create a new editor with the correct
        //ID - gradually incrementing it
        } else if (key === "editorID") {
          this.setState({
            editorIDs: this.props.fetchedUpdate.val
          })

        //resets the whiteboard for all users
        } else if (key === "confirmclear" && this.props.fetchedUpdate.val) {
          this.handleClearWhiteboard()

        } else if (this.props.fetchedUpdate.editors) {

          const editors = this.props.fetchedUpdate.editors

          //if it is an entirely new editor added by someone else i.e. the key doesn't exist yet locally
          if (!this.state.editorComponents[editors.key]) {
            this.setState(prevState => ({
              editorComponents: {
                  ...prevState.editorComponents,
                  [editors.key]: editors.val
              }
            }))
          } else if ((this.state.editorComponents[editors.key]["html"] !== editors.val["html"])) {
            this.setState(prevState => ({
              editorComponents: {
                  ...prevState.editorComponents,
                  [editors.key]: editors.val
              }
            }))
          } else if ((this.state.editorComponents[editors.key]['x']!== editors.val['x'])
            || (this.state.editorComponents[editors.key]['y']!== editors.val['y'])) {
            this.setState(prevState => ({
              editorComponents: {
                  ...prevState.editorComponents,
                  [editors.key]: {x: editors.val['x'], y: editors.val['y']}
              }
            }))
          } else {
            //console.log("child changed, but updated nowhere")
          }
        }
      } else if (this.props.fetchedUpdate.childDeleted){
        let newEditorComponents = this.state.editorComponents

        delete newEditorComponents[this.props.fetchedUpdate.childDeleted.key]
        this.setState({
          editorComponents: newEditorComponents
        })
      }
    }

    //Send updated sketchfield to database, and change state reflecting change
    if (this.sketchField.current
      && (this.state.lastRef.length < this.sketchField.current.toJSON().objects.length)
      && !this.state.clearingBoard) {

      const pathAndKey = `${this.props.path}/sketchfield`
      this.props.updateEditor({[pathAndKey]: JSON.stringify(this.sketchField.current)})
      this.setState({
        currentSketchField: this.sketchField.current,
        lastRef: this.sketchField.current.toJSON().objects
      })
    }
  }

  handleKeyDown = (event) => {
    // if the key down is either left or right-hand command key, the canvas is set to draggable, meaning items can be dragged now
    if ( event.keyCode === 91 || event.keyCode === 93 ){
      document.documentElement.style.cursor = "grab";
      this.props.setCanvasDraggable(true);
    }
    //if the keycode of the pressed key belongs to the 'alt/option' button, the cursor changes into a crosshair, and allows you to doodle on the canvas
    if ( event.keyCode === 18 ){
      this.setState({
        drawable: true
      })
    }
  }

  handleKeyUp = (event) => {
    //if keyup, then reset drawing and dragging back to false, meaning you can't draw or drag
    if ( (event.keyCode === 91 || event.keyCode === 93) && !this.props.dragnDropButtonActive ){
      document.documentElement.style.cursor = "default";
      this.props.setCanvasDraggable(false);
    }
    if ( event.keyCode === 18 ){
      this.setState({
        drawable: false
      })
    }
  }

  handleClick = (event) => {

    if (event.target.id === "canvas"){
      this.props.selectEditor(null)
    }
    if (this.state.firstClick === 0) {
      this.setState({
        firstClick: new Date()
      });
      setTimeout(() => {this.setState({firstClick: 0})}, 250)
    } else {
      let secondClick = new Date();
      if ((secondClick - this.state.firstClick) < 250) {
        this.doubleClick(event);
      }
    }
  }

  doubleClick = (event) => {

    if (event.target.id === "canvas" && this.props.canvasDraggable === false && !this.props.dragnDropButtonActive){
      const x = event.clientX
      const y = (event.clientY - 60)

      if ( this.state.editorIDs === 0) {
        const key = `editor0`
        const pathAndKey = `${this.props.path}/editors/${key}`
        const pathAndEditorID = `${this.props.path}/editorID`
        this.setState({
          editorIDs: 1,
          editorComponents: {[key]: {html: "", x:x, y:y}}
        })
        this.props.selectEditor(key)
        this.props.addEditor({[pathAndKey]: {html: "", x:x, y:y}, [pathAndEditorID]: 1})
      } else {
        let id = (this.state.editorIDs)
        let key = `editor${id}`
        const pathAndKey = `${this.props.path}/editors/${key}`
        this.setState(prevState => ({
          editorIDs: (id + 1),
          editorComponents: {
              ...prevState.editorComponents,
              [key]: {html: "", x:x, y:y}
          }
        }))

        this.props.selectEditor(key)

        const pathAndEditorID = `${this.props.path}/editorID`
        this.props.addEditor({[pathAndKey]: {html: "", x:x, y:y}, [pathAndEditorID]: id + 1})
      }
    }
  }

  // Triggered when mouse is moved
  handleMouseMove = (event) => {

    // if the editor is set to draggable, via either Redux props or the Grab n Drag button
    if(this.props.draggableEditor !== null && (this.props.canvasDraggable === true || this.props.dragnDropButtonActive === true)){

      let key = this.props.draggableEditor.key
      const html = this.state.editorComponents[key].html

      // xOffset and yOffset is the distance from the edge of the editor to where the mouse clicks inside of it - defined in froala.jsx, and passed into the Redux prop draggableEditor
      const x = (event.clientX - this.props.draggableEditor.xOffset)
      const y = (event.clientY - this.props.draggableEditor.yOffset)

      // if x and y are successfully defined above (without this, sometimes x and y remain undefined, and the app breaks)
      if (x && y){
        this.setState(prevState => ({
            editorComponents: {
                ...prevState.editorComponents,
                [key]: {html: html, x:x, y:y}
            }
          }))
        const xPath = `${this.props.path}/editors/${key}/x`
        const yPath = `${this.props.path}/editors/${key}/y`
        this.props.updateEditor({[xPath]:x, [yPath]:y})
      }
    }
  }

  // if mouse is released, then we stop dragging the editor, hence stopping it from updating
  handleMouseUp = () => {
    this.props.setDragging(null)
  }

  // we delete the editor locally - but note that we retain the index in this.state.editorIDs - this functions like IDs in databases, you don't want it to reset!
  handleDelete = () => {
    let newEditorComponents = this.state.editorComponents

    delete newEditorComponents[this.props.deletedEditorId]
    this.setState({
      editorComponents: newEditorComponents
    })
  }

  handleClearWhiteboard = () => {
    //delete all content up in the cloud
    //delete all content locally - editor Ids and editocompoenents and draw tool
    const pathname = this.props.path + '/editors/'
    const editorIDpath = this.props.path + '/editorID'
    const sketchfieldPath = this.props.path + '/sketchfield'
    const confirmationPathAndKey = this.props.path +'/confirmclear'

    this.setState({
      editorComponents: {},
      editorIDs: 0,
      currentSketchField: "",
      lastRef: [],
      fetchedSketchfield: {},
      clearingBoard: true
    }, () => {
      this.props.deleteEditor(pathname);
      this.props.deleteEditor(editorIDpath);
      this.props.deleteEditor(sketchfieldPath);
      this.props.updateEditor({[confirmationPathAndKey]: false});
      this.props.resetRedux(); // We reset all of our Redux props to their default
      document.documentElement.style.cursor = "default";

      //having the clearingBoard state allows us to stop certain updates that should not happen before everything has been cleared off the board
      //it allows us to quickly destroy and reinitialize the sketchpad, which solves some annoying problems where it wouldn't want to delete locally
      //due to a mismatch between the state and the ref of the sketchpad
      this.setState({
        clearingBoard: false
      })
    })
  }


  // The loader at the start is set to fade out once objects have been retrieved from Firebase
  // but we give it a slight lag, to ensure the data is already displayed when the loader actually fades out
  // otherwise sometimes the loader would fade, and only then the data would pop on the screen
  // also prevents users from adding new items before everything else loads
  fadeOutLoader = () => {
    setTimeout(() => {
      this.setState({
        fadeLoader: true
      })
      setTimeout(() =>{
        this.setState({
          loaderFaded: true
        })
      }, 500)
    }, 300)
  }

  // The intro fades out when we hit the close button
  fadeOutIntro = () => {

    const path = this.props.path + "/tutorialFinished"

    this.setState({
      fadeIntro: true // Triggers the CSS that makes the intro fade out
    })
    setTimeout(() => {
      this.setState({
        introFaded: true // Triggers the CSS that makes the intro 'display: none;'' (we do this, as "display:none" cannot be transitioned, so we just add it once the visual transition has completed)
      })
    }, 300)

    this.props.updateEditor({[path]: true}) //we create a Boolean in Firebase that allows us to know if the intro has already been watched, so it does not show when we reload the page
  }

  // Shows the intro if we select it from the button in the tools menu
  fadeInIntro = () => {
    const path = this.props.path + "/tutorialFinished"

    this.props.updateEditor({[path]: false})
    this.setState({
      introFaded: false,
      tutorialFinished: false
    }, () => {
      setTimeout(() => {
        this.setState({
          fadeIntro: false
        })
      }, 10)
    })
  }

  render(){
    let placeholderClass = "canvas-placeholder-visible"
    let sketchFieldClass = "sketchField sketchFieldInactive"
    let SketchFieldHolder
    let loaderClass = ""
    let loaderDivClass = "loaderDiv"


    if (this.state.fadeIntro) {
      placeholderClass = "canvas-placeholder-visible canvas-placeholder-hidden"
    }

    // If tutorial has been finished, but the fadeIntro hasn't been triggered yet
    // having second parameter prevents an infinite loops from happening
    // so that the minute fadeintro is true, we don't recall this.fadeOutIntro
    if (this.state.tutorialFinished === true && this.state.fadeIntro === false){
      this.fadeOutIntro()
    }

    // We make the sketchfield drawable, by adding pointer events via CSS class
    if (this.state.drawable === true || this.props.canvasDrawable === true){
      sketchFieldClass = "sketchField"
    }

    // this line resets the drawing board
    if (!this.state.clearingBoard) {
      SketchFieldHolder = <SketchField  width='1500px'
                              height='800px'
                              tool={Tools.Pencil}
                              lineColor='black'
                              lineWidth={3}
                              paintFirst="stroke"
                              value={this.state.fetchedSketchfield}
                              ref={this.sketchField}
                              />
    }

    // if we have fetched everything from Firebase, starting fading out the loader
    if (this.state.initialFetch === true && !this.state.fadeLoader) {
      this.fadeOutLoader()
    }

    // sets the CSS classes to the loader that make it fade and then "display: none;"
    if (this.state.fadeLoader) {
      loaderClass = "fadeoutLoader"
      loaderDivClass = " fadeoutLoaderDiv"
    }

    return(
          <div
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          >
            <div id="canvas-header">
              <a href="https://www.froala.com/wysiwyg-editor/"><img id="froala-logo" src="FroalaLogo.png" alt="Froala Logo - return to home page button"/></a>
              <h1> Whiteboard </h1>
            </div>

            {/* We only display the loader if the loaderFaded state is not true - if it is, then nothing displays */}
            {!this.state.loaderFaded &&
              <div className={loaderDivClass} style={{position: 'absolute', zIndex: '5', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img className={loaderClass} style={{width: '100px', height: '100px', background: 'transparent', filter: 'hue-rotate(110deg) brightness(0.62) contrast(400%)'}} src="Cells-256px.gif" alt="loading bar"/>
              </div>
            }

            {/* The tool menu */}
            <div id="controls">
              <Controls path={this.props.path} triggerIntro={this.fadeInIntro}/>
            </div>

            <div
              id="canvas"
              onClick={this.handleClick}
              onMouseMove={this.handleMouseMove}
              onMouseUp={this.handleMouseUp}
              tabIndex="0"
            >

              {/* If introFaded state is false, do this - otherwise, completely destroy component from Render function
              (as opposed to only rendering with CSS "display: none;") */}
              {!this.state.introFaded &&
                <div id="canvas-placeholder" className={placeholderClass}>

                  <Intro fadeOut={this.fadeOutIntro}/>
                </div>
              }

              {/* The sketching area - always there, but only drawable when pointer events have been added via CSS class */}
              <div className={sketchFieldClass}>
                {SketchFieldHolder}
              </div>

            {/* For every item in the editorComponents state, we map onto an instance of <Editor/>, which houses the Froala WYSIWYG editor */}
              {Object.keys(this.state.editorComponents).map( editor => {
                return <Editor id={editor}
                               x={this.state.editorComponents[editor].x}
                               y={this.state.editorComponents[editor].y}
                               html={this.state.editorComponents[editor].html}
                               canvasPath={this.props.path}
                               secondClick={this.state.secondClick}
                               styling={this.state.styling}
                               key={editor}/>
              })}
            </div>
          </div>
        )
  }
}

// Redux props

function mapDispatchToProps(dispatch) {
  return bindActionCreators( {
    selectEditor: selectEditor,
    setDragging: setDragging,
    setCanvasDraggable: setCanvasDraggable,
    addEditor: addEditor,
    updateEditor: updateEditor,
    fetchEditors: fetchEditors,
    fetchUpdates: fetchUpdates,
    deleteEditor: deleteEditor,
    resetRedux: resetRedux
  },
    dispatch
  );
}

function mapReduxStateToProps(reduxState) {
  return {
    selectedEditor: reduxState.selectedEditor,
    draggableEditor: reduxState.draggableEditor,
    canvasDraggable: reduxState.canvasDraggable,
    canvasDrawable: reduxState.canvasDrawable,
    deletedEditorId: reduxState.deletedEditorId,
    fetchedEditors: reduxState.fetchedEditors,
    fetchedUpdate: reduxState.fetchedUpdate,
    localUpdatedEditor: reduxState.localUpdatedEditor,
    isWhiteboardReset: reduxState.isWhiteboardReset,
    dragnDropButtonActive: reduxState.dragnDropButtonActive
  }
}

export default connect(mapReduxStateToProps, mapDispatchToProps)(Canvas);
