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

function urlCalculator() {
  return Math.floor(Math.random()*9000000000000+1000000000000).toString(36).substring(0, 15)
}

function CanvasHolder() {
  const location = useLocation();
  const history = useHistory();
  let path = "";
  if (location.pathname === '/') {
    path = `/${urlCalculator() + urlCalculator() + urlCalculator()}`
    history.push(path);
  } else {
    path = location.pathname
    // console.log(`location pathname: ${location.pathname}`)
  }

  return (
    <div className="App">
      <Canvas path={path}/>
    </div>
  );
}

export default App;
