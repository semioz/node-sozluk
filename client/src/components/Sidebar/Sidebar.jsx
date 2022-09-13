import React from 'react';
import "./styles.css";

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                        <li>entry</li>
                        <li>ikinci entry</li>
                    </li>
                </ul>
            </div>
        </div>
    );
};
 
export default Sidebar;