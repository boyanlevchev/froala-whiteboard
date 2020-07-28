import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import {  } from '../actions'

class Intro extends Component {
  constructor(props) {
    super(props);

    this.video1 = React.createRef()
    this.video2 = React.createRef()
    this.video3 = React.createRef()
    this.video4 = React.createRef()
    this.video5 = React.createRef()
    this.video6 = React.createRef()
    this.video7 = React.createRef()

    this.videos = [
      this.video1,
      this.video2,
      this.video3,
      this.video4,
      this.video5,
      this.video6,
      this.video7
    ]

    this.state = {
      index: 0
    };
  }

  nextClicked = () => {
    this.setState({
      index: this.state.index + 1
    }, () => {
      if (this.state.index > 0) this.videos[this.state.index-1].current.play()
    })
  }

  previousClicked = () => {
    this.setState({
      index: this.state.index - 1
    }, () => {
      if (this.state.index > 0) this.videos[this.state.index-1].current.play()
    })
  }

  render() {
    const index = this.state.index

    console.log()
    return (
      <div id="whiteboard-intro">

        <button id={"intro-close"} onClick={this.props.fadeOut}>
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>

        <div className="intro-carousel">
          {this.state.index === 0 &&
            <div className="intro-content fade-in">
              <h1 className="intro-header">Hey there!</h1>
              <p>This is the Froala Whiteboard - built using Froala's WYSIWYG editor.</p>
            </div>
          }
          {this.state.index === 1 &&
            <div className="intro-content fade-in">
              <p>It's super easy to get started - just double click anywhere on the whiteboard to add some content</p>
              <div className="small-video-holder">
                <video loop ref={this.video1}>
                  <source src="double-click.mp4" type="video/mp4"/>
                </video>
              </div>
            </div>
          }
          {this.state.index === 2 &&
            <div className="intro-content fade-in">
              <p>To add text, just click inside and start typing.</p>
              <div className="small-video-holder">
                <video loop ref={this.video2}>
                  <source src="add-text.mp4" type="video/mp4"/>
                </video>
              </div>
            </div>
          }
          {this.state.index === 3 &&
            <div className="intro-content fade-in">
              <p>And you can add media, like images and videos, by clicking on the pop-up toolbar.</p>
              <div className="small-video-holder">
                <video loop ref={this.video3}>
                  <source src="add-gif.mp4" type="video/mp4"/>
                </video>
              </div>
            </div>
          }
          {this.state.index === 4 &&
            <div className="intro-content fade-in">
              <p>Reposition your content by holding the <i>Command/⌘</i> key and then dragging with your mouse.</p>
              <div className="small-video-holder">
                <video loop ref={this.video4}>
                  <source src="reposition.mp4" type="video/mp4"/>
                </video>
              </div>
            </div>
          }
          {this.state.index === 5 &&
            <div className="intro-content fade-in">
              <p>You can also drag items with the <i>Grab n Drag</i> tool - check out the tool toggle menu for other tools as well! </p>
              <div className="tall-video-holder">
                <video loop ref={this.video5} className="tall-video">
                  <source src="show-tools.mp4" type="video/mp4"/>
                </video>
              </div>
            </div>
          }
          {this.state.index === 6 &&
            <div className="intro-content fade-in">
              <p>If you want to start again from scratch - just hit the <i>Clear Whiteboard</i> button - and voila!</p>
              <div className="tall-video-holder">
                <video loop ref={this.video6} className="tall-video">
                  <source src="clear-whiteboard.mp4" type="video/mp4"/>
                </video>
              </div>
            </div>
          }
          {this.state.index === 7 &&
            <div className="intro-content fade-in">
              <p>Finally - click the <i>Share</i> button to send your whiteboard to a friend and collaborate in real-time!</p>
              <div className="tall-video-holder">
                <video loop ref={this.video7} className="tall-video">
                  <source src="share-whiteboard.mp4" type="video/mp4"/>
                </video>
              </div>
            </div>
          }
        </div>

        <div className="intro-button-group">
          <button className="intro-button" disabled={index === 0 ? true : false} onClick={this.previousClicked}><h4>Previous</h4></button>
          <button className="intro-button" disabled={index === 7 ? true : false} onClick={this.nextClicked}><h4>Next</h4></button>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( {
  },
    dispatch
  );
}

function mapReduxStateToProps(reduxState) {
  return {
  }
}

export default connect(mapReduxStateToProps, mapDispatchToProps)(Intro);
