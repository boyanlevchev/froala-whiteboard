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

  componentDidUpdate(prevProps, prevState){
    if ((prevProps.html !== this.props.html) && (this.state.model !== this.props.html)){
      this.setState({
        model: this.props.html
      }, () => {
      this.handleToolbarUpdateViaProps(prevProps);
    });

    }
  }

  handleMouseOver = (e) => {
    if (e.target.tagName === 'IFRAME' && this.props.canvasDraggable) {
      e.preventDefault();
      e.stopPropagation();
      return false
    }
  }

  handleClick = (e) => {
    this.props.selectEditor(this.props.id)
    if (this.props.canvasDraggable){
      e.preventDefault()
    }
  }

  handleMouseDown = (event) => {
    this.props.selectEditor(this.props.id)
    if (this.props.canvasDraggable || this.props.dragnDropButtonActive) {
      event.preventDefault()
      console.log("canvas draggable", this.props.canvasDraggable)
      const yOffset = (event.clientY-this.props.y)
      const xOffset = (event.clientX-this.props.x)
      if (xOffset && yOffset){
        this.props.setDragging({key: this.props.id, yOffset: yOffset, xOffset: xOffset})
      }
    }
  }

  handleManualController = function(initControls) {
    initControls.initialize()
    this.initControls = initControls;
  }

  handleModelChange = function(model) {
    const htmlPath = `${this.props.canvasPath}/editors/${this.props.id}/html`
    const x = this.props.x
    const y = this.props.y

    console.log("model changed")

    if ((this.state.model === "" && model !== "") || (this.state.model !== "" && model === "")) {
      if (this.initControls) {
        console.log("triggered")
        this.initControls.destroy();
        this.setState({
          model: model
        })
        this.initControls.initialize()
        const editor = this.initControls.getEditor()

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

    this.props.updateEditorLocally({[this.props.id]: {html: model, x:x, y:y}})
    this.props.updateEditor({[htmlPath]: model})
  }

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
    var self = this;
    let editorClass = "editor"

    if (this.props.canvasDraggable || this.props.canvasDrawable || this.props.dragnDropButtonActive) {
      editorClass = editorClass + " inner-content-unclickable"
    }

    if (this.props.selectedEditor === this.props.id) {
      editorClass = editorClass + " selected-editor"
    }

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
      refreshAfterCallback: false,
      callback: function() {
        const htmlPath = `${self.props.canvasPath}/editors/${this.itemId}`
        this.toolbar.hide()
        self.props.deleteEditor(htmlPath);
      }
    })

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
          console.log("clicked")
          if (self.props.canvasDraggable) {
            console.log("clicked while draggable")
            e.preventDefault();
            return false;
          }
          self.handleMouseDown(e);
        },
        'keydown': function(e){
          if ( e.keyCode === 91 || e.keyCode === 93 ){
            self.props.setCanvasDraggable(true);
          }
        },
        'keyup': function(e) {
          if ( e.keyCode === 91 || e.keyCode === 93 ){
            // this.$el[0].style.pointerEvents = 'auto'
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
        className={editorClass}
        style={style}
        id={this.props.id}
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onMouseOver={this.handleMouseOver}
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
