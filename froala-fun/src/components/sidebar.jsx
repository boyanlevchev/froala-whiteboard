import React, { useState } from 'react';

function Sidebar(props) {

  let sidebarClass = ""

  if (!props.hidden) {
    sidebarClass = "hidden"
  }

  return (
    <div id="sidebar-menu" className={sidebarClass}>
      <button className={"sidebar-close"} onClick={props.closeSidebar}>
        X
      </button>


    </div>
  )
}


export default Sidebar;
