import React from 'react';
// import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";

import './App.css';

import Canvas from './containers/canvas'

function App() {
  // let location = useLocation();
  return (
    <Router>
      <Switch>
        <CanvasHolder/>
      </Switch>
    </Router>
  );
}

//url calculator function - simple random number generator
function urlCalculator() {
  return Math.floor(Math.random()*9000000000000+1000000000000).toString(36).substring(0, 15)
}

function CanvasHolder() {
  const location = useLocation();
  const history = useHistory();
  let path = "";
  //If statement checks to see if site is accessed without unqiue url - if so, unique url is appended
  //The second condition exists to allow the site to detremine if whiteboard is being accessed through froala.com/wyswig-editor/whiteboard
  if (location.pathname === '/') {
    path = `/${urlCalculator() + urlCalculator() + urlCalculator()}` //path generated using url calculator function
    history.push(path); //history.push appends the unique path - in case unique path is led by /wyswig-editor/whiteboard we first push that, and then add unique path
  } else if (location.pathname === '/contact/' || location.pathname === '/contact') {
    path = `/${urlCalculator() + urlCalculator() + urlCalculator()}` //path generated using url calculator function
    history.push('/contact' + path);
  } else if (location.pathname.includes('/contact/')) { //should only reach here if above conditions are not met, implying there is a unique url following pathname
    path = location.pathname.replace('/contact', '') //create path from unqiue path, by removing paths existent on froala website
  } else {
    path = location.pathname // if unique path is already present and site is access via herokuapp domain (i.e. site is accessed via unique link, then set path variable to what follows root)
  }

  //render canvas (whiteboard) component
  return (
    <div className="App">
      <Canvas path={path}/>
    </div>
  );
}

export default App;
