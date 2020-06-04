import React, { Component } from 'react'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { selectEditor, setDragging, setCanvasDraggable, updateEditor, deleteEditor } from '../actions'

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


class Editor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      firstClick: 0,
      editorComponents: {},
      editorIDs: [],
      lastContentId: 0,
      editorContents: {},
      lastSubmittedEditorContents: {},
      styling: "",
      secondClick: {}
    };
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

  handleChange = (editor) => {
    const htmlPath = `${this.props.canvasPath}/${this.props.id}/html`
    this.props.updateEditor({[htmlPath]: editor.html.get()})
  }


  render() {
    var self = this;
    let editorClass = "editor"

    if (this.props.id === this.props.selectedEditor){
      editorClass = "editor selected-editor"
    }
    // console.log(`${this.props.selectedEditor} = ${this.props.id}`)
    // console.log(editorClass)

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
          // self.state.initialHTML = this
          // console.log(`initialized html: ${this['html']}`)
          // setTimeout(froalaBanner(), 100);
          // console.log('this is init this');
          // console.log(this.html.get());

        },
        // 'focus': function () {
        //   // setTimeout(froalaBanner(), 100);
        //   // console.log('this is focus this');
        //   // console.log(this.html.get());
        // },
        // 'toolbar.show': function () {
        //   // setTimeout(froalaBanner(), 100);
        // },
        'contentChanged': function () {
          // console.log(this._reactInternalFiber.firstEffect.stateNode.firstElementChild.firstElementChild.children)
          console.log(`content changed html: ${this.html.get()}`)
          self.handleChange(this);
        },
        'click': (e) => {
          this.handleClick(e);
          this.props.setDragging(null);
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
          // setTimeout(froalaBanner(), 100);
          if ( e.keyCode === 91 || e.keyCode === 93 ){
            this.props.setCanvasDraggable(false);
          }
        }
        // ,
        // 'video.uploadedToS3': function(link, key, response) {
        //   console.log(`this is the video link: ${link}`)
        // },
        // 'image.uploadedToS3': function(link, key, response) {
        //   console.log(`this is the image link: ${link}`)
        // }
      },
      toolbarButtons: {
        'moreRich': {
            'buttons': ['insertImage', 'insertVideo', 'insertLink', 'insertFile', 'emoticons'],
            buttonsVisible: 5
          },
        'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting', 'alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
            buttonsVisible: 0
          },
        'custom': {
          'buttons':['deleteItem']
        }
      },
      key: self.props.styling,
      autofocus: true,
      toolbarInline: true,
      toolbarVisibleWithoutSelection: true,
      heightMin: '30',
      placeholderText: 'Type something \n or click inside me',
      charCounterCount: true,
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
      >
        <FroalaEditor
          config={config}
          model={this.props.html}
          lastContentId={this.state.lastContentId}
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
    deleteEditor: deleteEditor
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
