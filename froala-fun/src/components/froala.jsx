import React, { Component } from 'react'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { selectEditor, setDragging, setCanvasDraggable, updateEditor, deleteEditor, updateEditorLocally } from '../actions'

import FroalaEditor from 'react-froala-wysiwyg';
import Froalaeditor from 'froala-editor'

// import the toolbar plugins
import  'froala-editor/js/froala_editor.pkgd.min.js';

import  'froala-editor/js/plugins/image.min.js';
import  'froala-editor/js/plugins/video.min.js';
import  'froala-editor/js/plugins/colors.min.js';
import  'froala-editor/js/plugins/emoticons.min.js';
import  'froala-editor/js/plugins/font_family.min.js';
import  'froala-editor/js/plugins/font_size.min.js';
import  'froala-editor/js/plugins/line_height.min.js';
import  'froala-editor/js/plugins/lists.min.js';
import  'froala-editor/js/plugins/align.min.js';
import  'froala-editor/js/plugins/link.min.js';
import  'froala-editor/js/plugins/file.min.js';

// import the files for the the toolbar plugins.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

import 'froala-editor/css/plugins/image.min.css';
import 'froala-editor/css/plugins/video.min.css';
import 'froala-editor/css/plugins/colors.min.css';
import 'froala-editor/css/plugins/emoticons.min.css';
import 'froala-editor/css/plugins/file.min.css';


class Editor extends Component {

  constructor(props) {
    super(props);

    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleManualController = this.handleManualController.bind(this)

    this.state = {
      model: this.props.html,
      styling: "",
      secondClick: {}
    };
  }

  // This toolbar config exists to overcome a glitch with the editor, where the toolbar would not stay open if there is no text
  // So this config shows a reduced toolbar, which doesn't have text options - only image, video, and file upload options
  toolbarButtonsLess = {
    'moreRich': {
      'buttons': ['insertImage', 'insertVideo', 'insertLink', 'insertFile', 'emoticons'],
      buttonsVisible: 5
    },
    'custom': {
      'buttons':['deleteItem']
    }
  }

  // And then, if text gets added to the editor - the editor is destroeyd and recreated with a new toolbar with the following config
  toolbarButtonsMore = {
    'moreRich': {
        'buttons': ['insertImage', 'insertVideo', 'insertLink', 'insertFile', 'emoticons'],
        buttonsVisible: 5
      },
    'moreText': {
        'buttons': ['italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],
        buttonsVisible: 0
      },
    'moreParagraph': {
        'buttons': ['alignLeft', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'indent', 'quote'],
        buttonsVisible: 0
      },
    'custom': {
      'buttons':['deleteItem']
    }
  }

  // Updates an editor with data retrieved from Firebase, which gets passed through as a prop from canvas.jsx
  // Doesn't update your own editor if you are the one adding info to the editor, by comparing it to the local editor, before adding data
  componentDidUpdate(prevProps, prevState){
    if ((prevProps.html !== this.props.html) && (this.state.model !== this.props.html)){
      this.setState({
        model: this.props.html
      }, () => {
      this.handleToolbarUpdateViaProps(prevProps);
    });

    }
  }

  // Send into Redux prop the ID of the currently selected editor - which can then be used to drag the editor from canvas.jsx
  handleClick = (e) => {
    this.props.selectEditor(this.props.id)
    if (this.props.canvasDraggable){
      e.preventDefault()
    }
  }

  // As above, but also calculates the distance from mouse click to the end of the editor as x and y offset, and passes it through Redux to canvas.jsx (given its just a parent - yes, perhaps redux wasn't necessary)
  handleMouseDown = (event) => {

    this.props.selectEditor(this.props.id)

    // Only if the canvas is draggable i.e. drag button is clicked or Command button (On Mac - Windows might be Control) is held
    if (this.props.canvasDraggable || this.props.dragnDropButtonActive) {
      event.preventDefault()

      const yOffset = (event.clientY-this.props.y)
      const xOffset = (event.clientX-this.props.x)
      if (xOffset && yOffset){
        this.props.setDragging({key: this.props.id, yOffset: yOffset, xOffset: xOffset})
      }
    }
  }

  // Used to reinitialize the editor after we destroy it - for when we have to switch between toolbar configs
  handleManualController = function(initControls) {
    initControls.initialize()
    this.initControls = initControls;
  }

  // When content in the editor changes, this is called
  handleModelChange = function(model) {
    const htmlPath = `${this.props.canvasPath}/editors/${this.props.id}/html`
    const x = this.props.x
    const y = this.props.y

    console.log("model changed")

    // If model wasn't empty, but now it is - or vice versa - then destroy and reinitialize the editor with new corresponding toolbar
    // We do this, because there is a particular issue with Froala editor, that doesn't allow it to open the toolbar if there is no text input,
    // And there are multiple editor instances at the same time.
    if ((this.state.model === "" && model !== "") || (this.state.model !== "" && model === "")) {
      if (this.initControls) {

        this.initControls.destroy();
        this.setState({
          model: model
        })
        this.initControls.initialize()
        const editor = this.initControls.getEditor()

        // This allows us to re-focus on the editor after it is reinitialized
        setTimeout(function(){
          editor.events.focus();
          editor.selection.setAtEnd(editor.$el.get(0));
          editor.selection.restore();
          editor.toolbar.enable()
        }, 10);
      }
    } else {
      this.setState({
        model: model
      })
    }

    // Send all updates to the model up to parent, and to Firebase
    this.props.updateEditorLocally({[this.props.id]: {html: model, x:x, y:y}})
    this.props.updateEditor({[htmlPath]: model})
  }

  // The ComponentDidUpdate function leads here
  // Updates the model of the editor with information pulled from Firebase and passed down as a normal prop from the parent
  // Ensures that the toolbar is updated correctly when another user inputs something
  handleToolbarUpdateViaProps = function(prevProps) {
    if ((prevProps.html === "" && this.props.html !== "") || (prevProps.html !== "" && this.props.html === "")) {
      if (this.initControls) {
        console.log("toolbar updated thru props", this.state.model)
        this.initControls.destroy();
        this.initControls.initialize()
        const editor = this.initControls.getEditor()

        setTimeout(function(){
          editor.events.focus();
          editor.selection.setAtEnd(editor.$el.get(0));
          editor.selection.restore();
          // editor.toolbar.enable()
        }, 10);
      }
    }
  }

  render() {
    // we save the component this into a variable so we can reference in scoped functions later on
    var self = this;
    let editorClass = "editor"

    // We set inner content of the editor we are dragging to be unclickable
    // There was a minor glitch where, dragging the editor might sometimes result
    // In dragging items inside of the editor - an unwanted side effect
    // So we turn off the ability to click inside while we drag
    if (this.props.canvasDraggable || this.props.canvasDrawable || this.props.dragnDropButtonActive) {
      editorClass = editorClass + " inner-content-unclickable"
    }

    // Sets a nice little border so you visually see which editor is currently selected.
    if (this.props.selectedEditor === this.props.id) {
      editorClass = editorClass + " selected-editor"
    }

    // We create the style here for the <div> holding the froala editor, so that we can dynamically update its position
    // When we drag the editor from the parent - inputting new coordinates into 'top' and 'left'
    // Could be good to change this to 'transfrom: translate()' - as apparently that is graphically more stream-lined
    // but maybe comes with its own pitfalls
    let style = {
      position: 'absolute',
      top: `${this.props.y}px`,
      left: `${this.props.x}px`,
      minWidth: '200px',
      zIndex: '0'
    }

    // Here we define a custom Froala editor delete button icon to be placed in the toolbar
    Froalaeditor.DefineIcon('deleteItem', { NAME: 'deleteItem', SVG_KEY: 'remove' })
    Froalaeditor.RegisterCommand('deleteItem', {
      title: 'Delete this item',
      focus: true,
      undo: true,
      refreshAfterCallback: false,
      callback: function() {
        // When clicked, we delete the editor from Firebase, and make sure the toolbar goes away with it -
        // as sometimes the toolbar would remain on screen.
        const htmlPath = `${self.props.canvasPath}/editors/${this.itemId}`
        this.toolbar.hide()
        self.props.deleteEditor(htmlPath);
      }
    })

    // This is the config for the Froala editor
    const config = {
      events: {
        'initialized': function() {
          this["itemId"] = self.props.id;
        },
        'click': function(e)  {
          self.handleClick(e);
          self.props.setDragging(null);
        },
        'mousedown': function(e) {
          self.handleMouseDown(e);
        },
        'keydown': function(e){
          if ( e.keyCode === 91 || e.keyCode === 93 ){
            self.props.setCanvasDraggable(true);
          }
        },
        'keyup': function(e) {
          if ( e.keyCode === 91 || e.keyCode === 93 ){
            self.props.setCanvasDraggable(false);
          }
        }
      },
      toolbarButtons: this.state.model === "" ? this.toolbarButtonsLess : this.toolbarButtonsMore,
      initOnClick: true,
      toolbarVisibleWithoutSelection: true,
      key: self.props.styling,
      autofocus: false,
      toolbarInline: true,
      heightMin: '30',
      placeholderText: 'Type something \n or click inside me',
      attribution: false,
      videoUploadToS3: self.props.secondClick,
      imageUploadToS3: self.props.secondClick
    }
    return (
      <div
        style={style}
        className={editorClass}
        id={this.props.id}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}

      >
        <FroalaEditor
          config={config}
          model={this.state.model}
          onModelChange={this.handleModelChange}
          onManualControllerReady={this.handleManualController}
        />
      </div>
    );
  }
}

// Redux props
function mapDispatchToProps(dispatch) {
  return bindActionCreators( {
    selectEditor: selectEditor,
    setDragging: setDragging,
    setCanvasDraggable: setCanvasDraggable,
    updateEditor: updateEditor,
    deleteEditor: deleteEditor,
    updateEditorLocally: updateEditorLocally
  },
    dispatch
  );
}

function mapReduxStateToProps(reduxState) {
  return {
    selectedEditor: reduxState.selectedEditor,
    canvasDraggable: reduxState.canvasDraggable,
    canvasDrawable: reduxState.canvasDrawable,
    localUpdatedEditor: reduxState.localUpdatedEditor,
    dragnDropButtonActive: reduxState.dragnDropButtonActive
  }
}


export default connect(mapReduxStateToProps, mapDispatchToProps)(Editor);
