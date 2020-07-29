import React from 'react';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import {  } from '../actions'

function Footer(props) {

  return (
    <div id="footer-menu">
      <div id={"footer-map"}>
        <Container>
          <Row >
            <Col xs={6} sm={6} md={6} lg={3} xl={2}>
              <ul className={"footer-map-list"}>
                <li><a href="#for-patients-page">WYSIWYG EDITOR</a></li>
                <li><a href="#for-patients-page">Overview</a></li>
                <li><a href="#for-patients-page">Features</a></li>
                <li><a href="#for-patients-page">Pricing</a></li>
                <li><a href="#for-patients-page">Download</a></li>
                <li><a href="#for-patients-page">Examples</a></li>
                <li><a href="#for-patients-page">FAQ</a></li>
              </ul>
            </Col>
            <Col xs={6} sm={6} md={6} lg={3} xl={2}>
              <ul className={"footer-map-list"}>
                <li><a href="#research-page">DESIGN BLOCKS</a></li>
                <li><a href="#research-page">Overview</a></li>
                <li><a href="#research-page">Developers</a></li>
                <li><a href="#research-page">Designers</a></li>
                <li><a href="#research-page">Download</a></li>
                <li><a href="#research-page">Build</a></li>
                <li><a href="#research-page">FAQ</a></li>
              </ul>
            </Col>
            <Col xs={6} sm={6} md={6} lg={3} xl={1}>
              <ul className={"footer-map-list"}>
                <li><a href="#media-page">PAGES</a></li>
                <li><a href="#research-page">Overview</a></li>
                <li><a href="#research-page">Features</a></li>
                <li><a href="#research-page">Pricing</a></li>
                <li><a href="#research-page">Download</a></li>
                <li><a href="#research-page">Demo</a></li>
                <li><a href="#research-page">FAQ</a></li>
              </ul>
            </Col>
            <Col xs={6} sm={6} md={6} lg={3} xl={2}>
              <ul className={"footer-map-list"}>
                <li><a href="#about-page">RESOURCES</a></li>
                <li><a href="#research-page">Innovations</a></li>
                <li><a href="#research-page">Docs</a></li>
                <li><a href="#research-page">Quick Start</a></li>
                <li><a href="#research-page">Blog</a></li>
                <li><a href="#research-page">Support</a></li>
                <li><a href="#research-page">Contact Us</a></li>
              </ul>
            </Col>
            <Col xs={6} sm={6} md={6} lg={3} xl={2}>
              <ul className={"footer-map-list"}>
                <li><a href="#media-page">GET IN TOUCH</a></li>
                <li><a href="#media-page">twitter</a></li>
              </ul>
            </Col>
            <Col xs={6} sm={6} md={6} lg={3} xl={3}>
              <ul className={"footer-map-list"}>
                <li><a href="#media-page">SIGN UP</a></li>
                <li><a href="#media-page">twitter</a></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}


export default Footer;
