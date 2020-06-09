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

//Don't need this - will remove
// import { froalaBanner } from '../javascript/on_load';

// Require Font Awesome.
// import 'font-awesome/css/font-awesome.css';

// const Codox = window.Codox

class Editor extends Component {

  constructor(props) {
    super(props);

    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleManualController = this.handleManualController.bind(this)

    this.state = {
      model: this.props.html,
      // lastContentId: 0,
      styling: "",
      secondClick: {}
    };
  }

  toolbarButtonsLess = {
    'moreRich': {
      'buttons': ['insertImage', 'insertVideo', 'insertLink', 'insertFile', 'emoticons'],
      buttonsVisible: 5
    },
    'custom': {
      'buttons':['deleteItem']
    }
  }

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

  handleClick = () => {
    this.props.selectEditor(this.props.id)
  }

  handleMouseDown = (event) => {
    this.props.selectEditor(this.props.id)
    const yOffset = (event.clientY-this.props.y)
    const xOffset = (event.clientX-this.props.x)
    this.props.setDragging({key: this.props.id, yOffset: yOffset, xOffset: xOffset})
  }

  handleManualController = function(initControls) {
    initControls.initialize()
    this.initControls = initControls;
  }

  handleModelChange = function(model) {
    const key = this.props.id
    const x = this.props.x
    const y = this.props.y
    const htmlPath = `${this.props.canvasPath}/${this.props.id}/html`

    if (this.state.model === "" && model !== "") {
      if (this.initControls) {
        console.log("triggered")
        this.initControls.destroy();
        this.setState({
          model: model
        })
        // this.setState({
        //   toolbarButtons: this.toolbarButtonsMore
        // })
        this.initControls.initialize()
      }
    }
    if (this.state.model !== "" && model === "") {
      if (this.initControls) {
        this.initControls.destroy();
        this.setState({
          model: model
        })
        // this.setState({
        //   toolbarButtons: this.toolbarButtonsLess
        // })
        this.initControls.initialize()
      }
    }

    this.setState({
      model: model
    })

    this.props.updateEditor({[htmlPath]: model})
    this.props.updateEditorLocally({[key]: {html: model, x:x, y:y}})
  }

  // codoxInitialized = (editor) =>  {
  //   //assume these are passed in from parent
  //   // const {apiKey, docId, username} = this.props;
  //   // const Codox = window.
  //   //instantiate a Codox
  //   this.codox = new window.Codox();

  //   setTimeout(() =>  {
  //     //start or join the session
  //     this.codox.init({
  //       app      : 'froala',
  //       username : Math.floor((Math.random() * 10) + 1),
  //       docId    : Math.floor((Math.random() * 100) + 1),
  //       apiKey   : '0a9ee7fb-9c0a-4a05-9362-f5f36dbc4b58',
  //       editor   : editor
  //     });
  //   }, 100);
  // }

  render() {
    var self = this;
    let editorClass = "editor"

    // console.log("editor render triggered")

    let style = {
      position: 'absolute',
      top: `${this.props.y}px`,
      left: `${this.props.x}px`,
      minWidth: '170px'
    }

    Froalaeditor.DefineIcon('deleteItem', { NAME: 'deleteItem', SVG_KEY: 'remove' })
    Froalaeditor.RegisterCommand('deleteItem', {
      title: 'Delete this item',
      focus: true,
      undo: true,
      refreshAfterCallback: true,
      callback: function() {
        const htmlPath = `${self.props.canvasPath}/${this.itemId}`
        self.props.deleteEditor(htmlPath)
      },
    })

    const config = {
      events: {
        'initialized': function() {
          this["itemId"] = self.props.id;
          // console.log("initialized")
          // self.codoxInitialized(this)
        },
        'click': function(e)  {
          self.handleClick(e);
          self.props.setDragging(null);
        },
        'mousedown': (e) => {
          this.handleMouseDown(e);
        },
        'keydown': (e) => {
          if ( e.keyCode === 91 || e.keyCode === 93 ){
            this.props.setCanvasDraggable(true);
          }
        },
        'keyup': (e) => {
          if ( e.keyCode === 91 || e.keyCode === 93 ){
            this.props.setCanvasDraggable(false);
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
      charCounterCount: true,
      attribution: false,
      videoUploadToS3: self.props.secondClick,
      imageUploadToS3: self.props.secondClick
    }
    // console.log("this is the model", this.state.model, typeof this.state.model)
    // console.log("this is the toolbar", toolbarButtons)
    return (
      <div
        className={editorClass}
        style={style}
        id={this.props.id}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
      >
        <FroalaEditor
          config={config}
          model={this.state.model}
          // model={this.state.content}
          onModelChange={this.handleModelChange}
          onManualControllerReady={this.handleManualController}
          // lastContentId={this.state.lastContentId}
        />
      </div>
    );
  }
}

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
    canvasDraggable: reduxState.canvasDraggable
  }
}


export default connect(mapReduxStateToProps, mapDispatchToProps)(Editor);
