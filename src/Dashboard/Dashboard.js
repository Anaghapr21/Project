import React, { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Navbar from '../Navbar/Navbar'; // Import your Navbar component
import Home from '../Home/Home';
import User from '../User/User';
import UserRole from '../UserRole/UserRole';
import Permissions from '../Permissions/Permissions';
import Employee from '../Employee/Employee';
import AllocationTable from '../Allocation/AllocationTable';
import { mainListItems } from './listItems';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu'
// import { ListItem } from '@mui/material';
import {ListItem} from './listItems';
import CustomNavbar from './listItems';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
      loyalitsolutions.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme();

const Dashboard = ({username}) => {
  const [open, setOpen] = useState(true);
  const [route, setRoute] = useState('home');
  const [currentPage, setCurrentPage] = useState('Home');
  const [pageTitle,setPageTitle] = useState('Home');
  const handlePageChange=(pageName) => {
    setCurrentPage(pageName);

    switch (pageName ){
      case 'Home':
        setPageTitle('Home');
        break;
      case 'User':
        setPageTitle('User');
        break;
      case 'UserRole':
        setPageTitle('UserRole');
        break;
      case 'Permissions':
        setPageTitle('Permissions');
        break;
      case 'Employee':
        setPageTitle('Employee');
        break;
      case 'AllocationTable':
        setPageTitle('Allocation')
        break;
      default:
        setPageTitle('Home');
    }
    setOpen(false);
  }

  const handleRouteChange = (newRoute) => {
    setRoute(newRoute);
    setOpen(false); // Close the drawer when route changes
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleLogout = () => {
    // Handle logout functionality (clear token, redirect, etc.)
    localStorage.removeItem('token');
    // Redirect or perform any action upon logout
    // For example, redirect to the login page
    window.location.href = '/login';
    // history.push('/login');
  };
 
  return (
    <ThemeProvider theme={defaultTheme}>
      <CustomNavbar onPageChange={handlePageChange} onLogout={handleLogout} username={username}/>

      <Toolbar />
           <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
               {/* Render content based on the selected route */}
               {currentPage === 'Home' && <Home />}
              {currentPage === 'User' && <User />}
               {currentPage === 'UserRole' && <UserRole />}
           {currentPage === 'Permissions' && <Permissions />}
             {currentPage === 'Employee' && <Employee />}
             {currentPage === 'AllocationTable' && <AllocationTable />}
             </Grid>
           </Container>
    </ThemeProvider>
  );
};

export default Dashboard;
