
import React from 'react';
import './Navbar.css'; // Import your CSS file for Navbar styling



const Navbar = ({handleRouteChange,handleLogout}) => {

  
  return (

    <nav className="navbar">
      
      <button onClick={() => handleRouteChange('home')}>Home</button>
      <button onClick={() => handleRouteChange('user')}>User</button>
      <button onClick={() => handleRouteChange('userrole')}>UserRole</button>
      <button onClick={() => handleRouteChange('permissions')}>Permissions</button>
      <button onClick={() => handleRouteChange('employee')}>Employee</button>
      <button onClick={() => handleRouteChange('timecycle')}>TimeCycle</button>
      <button onClick={() => handleRouteChange('allocationtable')}>AllocationTable</button>
      <button onClick={handleLogout}>Logout</button>
    </nav>
    // <nav className="navbar">
    //   <div className="navbar-logo">
    //     <span>Your Logo</span>
    //   </div>
    //   <ul className="navbar-links">
      
    //     <li><a href="#">Home</a></li>
    //     <li><a href="#">About</a></li>
    //     <li><a href="#">Services</a></li>
    //     <li><a href="#">Contact</a></li>
    //   </ul>
    //   <div className="navbar-logout">
    //     <button onClick={handleLogout}>Logout</button>
    //   </div>
    // </nav>
  );
};

export default Navbar;
