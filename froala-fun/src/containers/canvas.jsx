import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { selectEditor, setDragging, setCanvasDraggable, addEditor, updateEditor, fetchEditors, fetchUpdates } from '../actions'

// import { froalaBanner } from '../javascript/on_load';

import Editor from '../components/froala'
import {SketchField, Tools} from 'react-sketch';

class Canvas extends Component {
  constructor(props) {
    super(props);

    this.props.setCanvasDraggable(false);

    this.sketchField = React.createRef();

    this.state = {
      firstClick: 0,
      editorComponents: {},
      editorIDs: [],
      drawable: false,
      currentSketchField: "",
      lastRef: [],
      fetchedSketchfield: {},
      secondClick: {},
      styling: "",
      mediaCounter: 0
    };
  }

  componentDidMount() {
    fetch('/get_signature').then(res => res.json()).then( res => {
      this.setState({secondClick:res})
    })
    fetch('get_frofro').then(res => res.text()).then( res => {
      this.setState({styling: res})
    })
    // console.log(fetch( '/get_signature').then(res => res.json()))
    this.props.fetchEditors(this.props.path.substring(1))
    this.props.fetchUpdates(this.props.path.substring(1))
  }

  componentDidUpdate(prevProps) {

    if (this.props.fetchedEditors && (Object.keys(this.state.editorComponents).length === 0 && Object.keys(this.state.fetchedSketchfield).length === 0)) {
      const { sketchfield, ...editors } = this.props.fetchedEditors;
      if (Object.keys(editors).length !== 0) {
        this.setState({
          editorIDs: [...Array(Object.keys(editors).length).keys()],
          editorComponents: editors,
          fetchedSketchfield: this.props.fetchedEditors.sketchfield
        })
      }
    }

    if (this.props.deletedEditorId in this.state.editorComponents) {
      this.handleDelete();
    }

    if (prevProps.fetchedUpdate !== this.props.fetchedUpdate) {
      const key = this.props.fetchedUpdate.key;
      if (key !== "sketchfield") {
        this.setState(prevState => ({
          editorComponents: {
              ...prevState.editorComponents,
              [key]: this.props.fetchedUpdate.val
          }
        }))
      } else if (key === "sketchfield") {
        this.setState(prevState => ({
          fetchedSketchfield: this.props.fetchedUpdate.val,
          currentSketchField: this.props.fetchedUpdate.val,
          lastRef: JSON.parse(this.props.fetchedUpdate.val).objects
        }))
      }
    }

    if (this.sketchField.current && (this.state.lastRef.length < this.sketchField.current.toJSON().objects.length)) {
      const pathAndKey = `${this.props.path}/sketchfield`
      this.props.updateEditor({[pathAndKey]: JSON.stringify(this.sketchField.current)})
      this.setState({
        currentSketchField: this.sketchField.current,
        lastRef: this.sketchField.current.toJSON().objects
      })
    }

  }

  handleKeyDown = (event) => {
    if ( event.keyCode === 91 || event.keyCode === 93 ){
      document.documentElement.style.cursor = "grab";
      this.props.setCanvasDraggable(true);
    }
    if ( event.keyCode === 18 ){
      this.setState({
        drawable: true
      })
    }
  }

  handleKeyUp = (event) => {
    if ( event.keyCode === 91 || event.keyCode === 93 ){
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
    // froalaBanner(); // temporary
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
    if (event.target.id === "canvas" && this.props.canvasDraggable === false){
      const x = event.clientX
      const y = (event.clientY - 60)
      if ( this.state.editorIDs.length === 0) {
        console.log(`This is the editorIDs length: ${this.state.editorIDs.length}`)
        const key = `editor0`
        const pathAndKey = `${this.props.path}/${key}`
        this.setState({
          editorIDs: [0],
          editorComponents: {[key]: {html: "", x:x, y:y}}
        })
        this.props.selectEditor(key)
        this.props.addEditor({[pathAndKey]: {html: "", x:x, y:y}})
      } else {
        let id = (this.state.editorIDs[this.state.editorIDs.length - 1] + 1)
        let key = `editor${id}`
        const pathAndKey = `${this.props.path}/${key}`
        this.setState(prevState => ({
          editorIDs: [...prevState.editorIDs, id],
          editorComponents: {
              ...prevState.editorComponents,
              [key]: {html: "", x:x, y:y}
          }
        }))

        this.props.selectEditor(key)

        this.props.addEditor({[pathAndKey]: {html: "", x:x, y:y}})
      }
    }
  }

  handleMouseMove = (event) => {
    if(this.props.draggableEditor !== null && this.props.canvasDraggable === true){
      let key = this.props.draggableEditor.key
      const x = (event.clientX - this.props.draggableEditor.xOffset)
      const y = (event.clientY - this.props.draggableEditor.yOffset)
      this.setState(prevState => ({
          editorComponents: {
              ...prevState.editorComponents,
              [key]: {html: this.state.editorComponents.html, x:x, y:y}
          }
        }))
      const xPath = `${this.props.path}/${key}/x`
      const yPath = `${this.props.path}/${key}/y`
      this.props.updateEditor({[xPath]:x, [yPath]:y})
    }
  }

  handleMouseUp = () => {
    this.props.setDragging(null)
  }

  handleDelete = () => {
    let newEditorComponents = this.state.editorComponents

    delete newEditorComponents[this.props.deletedEditorId]
    this.setState({
      editorComponents: newEditorComponents
    })
  }

  render(){
    let placeholderClass = "canvas-placeholder-visible"
    let sketchFieldClass = "sketchField sketchFieldInactive"

    if (Object.keys(this.state.editorComponents).length > 0){
      placeholderClass = "canvas-placeholder-hidden"
    } else {
      placeholderClass = "canvas-placeholder-visible"
    }
    if (this.state.drawable === true){
      sketchFieldClass = "sketchField"
    }

    // if (this.props.fetchedUpdate) {
    //   console.log(this.props.fetchedUpdate)
    // }

    return(
          <div>
            <div id="canvas-header">
              <h1>Froala Canvas</h1>
            </div>
            <div
              id="canvas"
              onClick={this.handleClick}
              onKeyDown={this.handleKeyDown}
              onKeyUp={this.handleKeyUp}
              onMouseMove={this.handleMouseMove}
              onMouseUp={this.handleMouseUp}
              tabIndex="0"
            >
              <div id="canvas-placeholder">
                <h3 className={placeholderClass} >Double-click anywhere to begin...</h3>
              </div>
              <div id="controls">
                <p>{this.state.test}</p>
                <p>Hold 'cmd' to drag items</p>
                <p>Hold 'alt' to draw</p>
              </div>
              <div className={sketchFieldClass} onKeyDown={this.handleKeyDown}>
                <SketchField  width='1500px'
                              height='800px'
                              tool={Tools.Pencil}
                              lineColor='black'
                              lineWidth={3}
                              paintFirst="stroke"
                              value={this.state.fetchedSketchfield}
                              ref={this.sketchField}
                              />

              </div>
              {Object.keys(this.state.editorComponents).map( editor => {
                // console.log(editor)
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators( {
    selectEditor: selectEditor,
    setDragging: setDragging,
    setCanvasDraggable: setCanvasDraggable,
    addEditor: addEditor,
    updateEditor: updateEditor,
    fetchEditors: fetchEditors,
    fetchUpdates: fetchUpdates
  },
    dispatch
  );
}

function mapReduxStateToProps(reduxState) {
  return {
    selectedEditor: reduxState.selectedEditor,
    draggableEditor: reduxState.draggableEditor,
    canvasDraggable: reduxState.canvasDraggable,
    deletedEditorId: reduxState.deletedEditorId,
    fetchedEditors: reduxState.fetchedEditors,
    fetchedUpdate: reduxState.fetchedUpdate
  }
}

export default connect(mapReduxStateToProps, mapDispatchToProps)(Canvas);
