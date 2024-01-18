import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { AccountCircle as AccountCircleIcon, ExitToApp as ExitToAppIcon  } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddTaskIcon from '@mui/icons-material/AddTask';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
function CustomNavbar({ onPageChange, onLogout, username }) {
  return (
    <Navbar expand="lg" bg="custom-background-color" style={{ marginBottom: '20px', color: 'custom-text-color' }}>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          
          <Nav className="me-auto">
          <Nav.Link
            onClick={() => onPageChange('Home')}
            style={{ marginRight: '40px', display: 'flex', alignItems: 'center',  color: 'white' }}
          >
            <DashboardIcon style={{ marginRight: '8px' }} /> Home
          </Nav.Link>


          
            <Nav.Link 
                onClick={() => onPageChange('User')} 
                style={{ marginRight: '40px', display: 'flex', alignItems: 'center ',  color: 'white'}}>
                  <PersonIcon style={{marginRight: '8px'}} />User</Nav.Link>



            <Nav.Link onClick={() => onPageChange('UserRole')} style={{ marginRight: '40px', display: 'flex', alignItems: 'center ',  color: 'white' }}>
              <GroupAddIcon style={{marginRight: '8px'}} />UserRole</Nav.Link>
            <Nav.Link onClick={() => onPageChange('Permissions')} style={{ marginRight: '40px', display: 'flex', alignItems: 'center ',  color: 'white' }}><AddTaskIcon style={{marginRight: '8px'}} />Permissions</Nav.Link>
            <Nav.Link onClick={() => onPageChange('Employee')} style={{ marginRight: '40px', display: 'flex', alignItems: 'center ',  color: 'white' }}><GroupsIcon style={{marginRight: '8px'}}/>Employee</Nav.Link>
            <Nav.Link onClick={() => onPageChange('TimeCycle')} style={{ marginRight: '40px', display: 'flex', alignItems: 'center ' ,  color: 'white'}}><AssignmentIcon style={{marginRight: '8px'}} />Time Cycle</Nav.Link>

            <Nav.Link onClick={() => onPageChange('AllocationTable')} style={{ marginRight: '40px', display: 'flex', alignItems: 'center ' ,  color: 'white'}}><AssignmentIcon style={{marginRight: '8px'}} />Allocation</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <NavDropdown title={<div style={{color: 'white'}}><AccountCircleIcon style={{ marginRight: '5px' }} /> {username}</div>}>
              <NavDropdown.Item onClick={() => onPageChange('Home')}>
                <Nav.Link onClick={onLogout} ><ExitToAppIcon style={{ marginRight: '5px' }} /> Logout</Nav.Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;

