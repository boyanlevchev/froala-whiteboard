import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";

// import Sidebar from './components/sidebar'
import Canvas from './containers/canvas'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBars } from '@fortawesome/free-solid-svg-icons'

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  // Below we use React router to allow us to access location and history of current page (housed in <Switch>)
  // Then we render CanvasHolder, which holds the Canvas component, and calculates a unique URL

  return (
    <Router basename={'/wysiwyg-editor/whiteboard'}>
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

//a function that calculates the unqiue url for the generated whiteboard
function CanvasHolder() {

  // const [sidebarHidden, setSidebarHidden] = useState(false);

  const location = useLocation();
  const history = useHistory();
  let path = "";
  //If statement checks to see if site is accessed without unqiue url - if so, unique url is appended
  //The second condition exists to allow the site to detremine if whiteboard is being accessed through froala.com/wyswig-editor/whiteboard
  if (location.pathname === '/') {
    path = `/${urlCalculator() + urlCalculator() + urlCalculator()}` //path generated using url calculator function
    history.push(path); //history.push appends the unique path - in case unique path is led by /wyswig-editor/whiteboard we first push that, and then add unique path

    //below checks if the staging site's path matches the pathname - if staging site changes, ensure if statement is checking for everything after domain name
  } else if (location.pathname === '/contact/' || location.pathname === '/contact') {
    path = `/${urlCalculator() + urlCalculator() + urlCalculator()}`
    history.push('/contact' + path); //appends unique path ALONG with pathname (as push replaces entire path)

    //below check if the main Froala site's path matches the pathname
  } else if (location.pathname === '/wysiwyg-editor/whiteboard/' || location.pathname === '/wysiwyg-editor/whiteboard') {
    path = `/${urlCalculator() + urlCalculator() + urlCalculator()}` //path generated using url calculator function
    history.push('/wysiwyg-editor/whiteboard' + path); //appends unique path ALONG with pathname

    //below should only be reached if above conditions are not met, implying there is a unique url following pathname.
    //so we just extract unique url from path, to be used later in component's children for redirecting info into Firebase
  } else if (location.pathname.includes('/contact/')) {
    path = location.pathname.replace('/contact', '') //create path from unqiue path, by removing paths existent on staging website to isolate the unique url
  } else if (location.pathname.includes('/wysiwyg-editor/whiteboard/')) {
    path = location.pathname.replace('/wysiwyg-editor/whiteboard', '') //create path from unqiue path, by removing paths existent on froala website to isolate the unique url
  } else {
    path = location.pathname // if unique path is already present and site is accessed via herokuapp domain (i.e. site is accessed via unique link, then set path variable to what follows root)
  }

  //returns canvas component with above-calculated unique url as prop (canvas was old name for the whiteboard, when it was still an art canvas for Net Art and web2.0 content)
  return (
    <div id="app" className="App">
      {/*<button className={"sidebar-open"} onClick={()=>{setSidebarHidden(true)}}><FontAwesomeIcon icon={faBars} size="lg"/></button>
            <Sidebar hidden={sidebarHidden} closeSidebar={()=>{setSidebarHidden(false)}}/>*/}
      <Canvas path={path}/>
    </div>
  );
}



export default App;
