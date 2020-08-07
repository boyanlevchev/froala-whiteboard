import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPen, faHandPaper, faShareAlt } from '@fortawesome/free-solid-svg-icons'

import { resetWhiteboard, addEditor, setCanvasDrawable, setDragnDropButtonActive } from '../actions'

import {CopyToClipboard} from 'react-copy-to-clipboard';

class Controls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: null,
      penButtonActive: false,
      dragnDropButtonActive: false,
      shareClicked: false
    };

    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  // Expand or retract the tool menu
  handleExpandClick = () => {
    if (this.state.isExpanded === null) {
      this.setState({
      isExpanded: true
    });
    } else if (this.state.isExpanded === true || this.state.isExpanded === false) {
      this.setState(state => ({
      isExpanded: !state.isExpanded
    }));
    }
  }

  // Sets the pen tool active, and makes the canvas "drawable"
  handlePenButton = () => {
    this.setState({
      penButtonActive: !this.state.penButtonActive,
      dragnDropButtonActive: false
    }, () => {
      if (this.state.penButtonActive) {
        this.props.setCanvasDrawable(true)
        this.props.setDragnDropButtonActive(false)
      } else if (!this.state.penButtonActive) {
        this.props.setCanvasDrawable(false)
      }
    })
  }

  // sets the grab n drag tool active, and makes editors "draggable"
  handleDragnDropButton = () => {
    this.setState({
      dragnDropButtonActive: !this.state.dragnDropButtonActive,
      penButtonActive: false
    }, () => {
      if (this.state.dragnDropButtonActive) {
        this.props.setDragnDropButtonActive(true)
        this.props.setCanvasDrawable(false)
        document.documentElement.style.cursor = "grab";
      } else if (!this.state.dragnDropButtonActive) {
        this.props.setDragnDropButtonActive(false)
        document.documentElement.style.cursor = "default";
      }
    })
  }

  // deletes everything on the screen - sends the delete message through FireBase so it can be retrieved by all open sessions of the Whiteboard
  handleDeleteButton = () => {
    const confirmation = window.confirm("Are you sure you want to delete? This can't be undone");
    if ( confirmation === true ) {
      // this.props.resetWhiteboard(true)
      const confirmationPathAndKey = this.props.path +'/confirmclear'
      this.props.addEditor({[confirmationPathAndKey]: true})
    }
  }

  // Changes the state between true and false to allow for the animation that happens on clicking - farther down the actual url gets copied to clipboard
  handleCopyLink = () => {
    this.setState({
      shareClicked: true
    })
    setTimeout(() => {
      this.setState({shareClicked: false});
    }, 2000)
  }

  // resets the animation for the share button if the mouse leaves it
  handleMouseLeft = () => {
    this.setState({shareClicked: false});
  }

  render() {
    // The CSS for the main tool menu toggle button
    const expandStyle = {
      border: '3px solid #0599F7',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      backgroundColor: 'white',
      color: '#0599F7',
      marginBottom: '20px',
      textAlign: 'center'
    }


    let toggleClass = ""
    let togglerText = "Show tools"
    let penClass = "tools"
    let dragnDropClass = "tools"
    let shareHeader = "Share"
    let shareText = "Copy the link to this whiteboard and send it to your friends and coworkers"
    let shareTooltipTextClass = "shareTooltipTextClass"
    let shareTooltipClass = ""
    let shareTooltipHeaderClass = "shareTooltipHeaderClass"
    let jello = ""

    // Sets CSS classes and text of the tool menu toggle to animate and pass through information
    if (this.state.isExpanded === true){
      toggleClass = "toolsExpand"
      togglerText = "Hide tools"
    } else if (this.state.isExpanded === false) {
      toggleClass = "toolsContract"
      togglerText = "Show tools"
    }

    // Changes the styling of the pen button when active
    if (this.props.canvasDrawable) {
      penClass += " penButtonActive"
    }

    // Changes the styling of the grab n drag button when active
    if (this.props.dragnDropButtonActive) {
      dragnDropClass += " dragnDropButtonActive"
    }

    // Changes the CSS and text for the share button, and animates the info tooltip
    if (this.state.shareClicked) {
      shareHeader = null
      shareText = "Link to whiteboard has been copied! \n You can now send it to anybody!"
      shareTooltipTextClass = "shareTooltipTextClassClicked"
      shareTooltipClass = "shareTooltipClass"
      jello = "jello-horizontal"
    }


    return (
      <div>
        <Accordion>
          <div style={{position: "fixed", bottom: "0", zIndex: "1"}}>

            {/* The tool menu toggle button, with a tooltip that shows info when hovering */}
            <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-pen`}>
                      <strong>{togglerText}</strong>
                    </Tooltip>
                  }
                >
              <Accordion.Toggle as={Button} onClick={this.handleExpandClick} style={expandStyle} className={toggleClass} variant="link" eventKey="0">

                <FontAwesomeIcon icon={faPlus} size="2x"/>

              </Accordion.Toggle>
            </OverlayTrigger>
          </div>

          <Accordion.Collapse eventKey="0">
            <div style={{display: 'flex', flexDirection: 'column', width: '60px'}}>

              {/* The button for the pen tool, along with a tooltip that shows info when hovering */}
              <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-pen`}>
                      <strong>Draw tool</strong><br/><small><i>Shortcut: hold 'alt' and draw with mouse</i></small>
                    </Tooltip>
                  }
                >
                <button className={penClass} id={"penButton"} onClick={this.handlePenButton} ><FontAwesomeIcon icon={faPen} size="1x"/></button>
              </OverlayTrigger>


              {/* The button for the Grab n Drag tool, along with a tooltip that shows info when hovering */}
              <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-hand`}>
                      <strong>Grab n Drag tool</strong><br/><small><i>Shortcut: hold 'cmd' and click an item then drag with mouse</i></small>
                    </Tooltip>
                  }
                >
                <button className={dragnDropClass} id={"dragnDropButton"} onClick={this.handleDragnDropButton} ><FontAwesomeIcon icon={faHandPaper} size="1x"/></button>
              </OverlayTrigger>

              {/* The button for sharing, along with a tooltip that shows info when hovering - also changes inner text dependent on state.shareClicked.
                  In addition, this houses the <CopyToClipboard/> componenet which is a cross browser and device plugin for copying text (in this case the url) to clipboard*/}
              <OverlayTrigger
                placement={"right"}
                overlay={
                  <Tooltip id={`tooltip-share`} className={shareTooltipClass}>
                    <div className={jello}>
                      {!this.state.shareClicked && <span><strong className={shareTooltipHeaderClass}>{shareHeader}</strong><br/></span>}<small><i className={shareTooltipTextClass}>{shareText}</i></small>
                    </div>
                  </Tooltip>
                }
              >
                <CopyToClipboard text={window.location.href} onCopy={this.handleCopyLink}>
                  <button className={"tools"} id={"shareButton"} onClick={this.handleCopyLink} onMouseLeave={this.handleMouseLeft}><FontAwesomeIcon icon={faShareAlt} size="1x"/></button>
                </CopyToClipboard>
              </OverlayTrigger>


              {/* The button to reopen the tutorial, along with a tooltip that shows info when hovering */}
              <OverlayTrigger
                placement={"right"}
                overlay={
                  <Tooltip id={`tooltip-tutorial`}>
                      <strong>Tutorial</strong><br/><small><i>Click to watch the tutorial again!</i></small>
                  </Tooltip>
                }
              >
                <button className={"tools"} id={"tutorialButton"} onClick={this.props.triggerIntro}>?</button>
              </OverlayTrigger>


              {/* The button for clearing the whiteboard, along with a tooltip that shows info when hovering */}
              <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-delete`}>
                      <strong>Clear whiteboard</strong><br/><small><i>Start from scratch</i></small>
                    </Tooltip>
                  }
                >
                <button className={"tools finalTool"} id={"clearWhiteboardButton"} onClick={this.handleDeleteButton}><FontAwesomeIcon icon={faTrash} size="1x"/></button>
              </OverlayTrigger>


            </div>
          </Accordion.Collapse>
        </Accordion>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( {
    resetWhiteboard: resetWhiteboard,
    addEditor: addEditor,
    setCanvasDrawable: setCanvasDrawable,
    setDragnDropButtonActive: setDragnDropButtonActive
  },
    dispatch
  );
}

function mapReduxStateToProps(reduxState) {
  return {
    canvasDrawable: reduxState.canvasDrawable,
    dragnDropButtonActive: reduxState.dragnDropButtonActive
  }
}

export default connect(mapReduxStateToProps, mapDispatchToProps)(Controls);
