import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TextField, Modal, Paper, Container, Typography, Grid } from '@mui/material';
import '@mui/material/styles';
import BASE_URL from '../config';

const User = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password:'',
    email:'',
    is_active:''
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token not found in local storage');
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/users/all/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`${BASE_URL}/api/users/${formData.id}/`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
      } else {
        await axios.post(`${BASE_URL}/api/users/`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
      }
      setFormData({});
      fetchUsers();
      setShowUpdateModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateUser = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      password: user.password,
      emai:user.email,
      is_active: user.is_active
    });
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const deactivateUser = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/api/users/${userId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const handleAddNewUser = () => {
    setShowUpdateModal(true);
    setFormData({});
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedUser(null);
    fetchUsers();
  };

  const handleAddNewAdminUser = () => {
    setShowAddModal(true);
    setFormData({});
    setSelectedUser(null);
  };

  const handleSubmitAddAdminUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/admin/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setFormData({});
      fetchUsers();
      setShowAddModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error adding admin user:', error);
    }
  };

  return (
    <div className="user-container" style={{ textAlign: 'center' }}>
      <div className="user-list">
        <h2> User Details</h2>
        <TableContainer component={Paper} style={{ minWidth: '700px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} style={{ height: '60px' }}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>
                    <Button onClick={() => deactivateUser(user.id)}>Deactivate</Button>
                    <Button onClick={() => updateUser(user)}>Update</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="user-form">
        {!showUpdateModal && !selectedUser && (
          <Button variant="contained" color="primary" onClick={handleAddNewUser}>
            Add New User
          </Button>
        )}

        {showUpdateModal && (
          <Modal open={showUpdateModal} onClose={handleCloseModal} style={{ marginTop: '50px' }}>
            <Paper className="update-modal">
              <Container maxWidth="sm">
                <Typography variant="h5">
                  {selectedUser ? 'Update User' : 'Add New User'}
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Username"
                        fullWidth
                        value={formData.username || ''}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        fullWidth
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="is_active"
                        fullWidth
                        value={formData.is_active || ''}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                  <Button variant="contained" color="success" type="submit">
                    Submit
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </form>
              </Container>
            </Paper>
          </Modal>
        )}

        {!showUpdateModal && !selectedUser && (
          <Button variant="contained" color="primary" onClick={handleAddNewAdminUser}>
            Add New Admin User
          </Button>
        )}

        <Modal open={showAddModal} onClose={() => setShowAddModal(false)} style={{ marginTop: '50px' }}>
          <Paper className="add-admin-modal">
            <Container maxWidth="sm">
              <Typography variant="h5">Add Admin User</Typography>
              <form onSubmit={handleSubmitAddAdminUser}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      fullWidth
                      value={formData.username || ''}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      fullWidth
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      type="password"
                      fullWidth
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="is_staff"
                      fullWidth
                      value={formData.is_staff || ''}
                      onChange={(e) => setFormData({ ...formData, is_staff: e.target.value })}
                    />
                  </Grid>
                </Grid>
                <Button variant="contained" color="primary" type="submit">
                  Add Admin User
                </Button>
              </form>
              <Button variant="contained" color="secondary" onClick={() => setShowAddModal(false)}>
                Close
              </Button>
            </Container>
          </Paper>
        </Modal>
      </div>
    </div>
  );
};

export default User;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import { Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TextField, Modal, Paper, Container, Typography, Grid } from '@mui/material';
// import '@mui/material/styles';
// import BASE_URL from '../config';

// const User = () => {
//   const [users, setUsers] = useState([]);
//   // const [formData, setFormData] = useState({});
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     email: '',  // Add this line
//     is_active: '',
    
//   });
  
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const accessToken = localStorage.getItem('accessToken');

//       if (!accessToken) {
//         console.error('Access token not found in local storage');
//         return;
//       }

//       const response = await axios.get(`${BASE_URL}/api/users/all/`, {
//         headers: {
//           Authorization: Bearer  `${accessToken}`,
//         },
//       });
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (formData.id) {
//         await axios.put(`${BASE_URL}/api/users/${formData.id}/`, formData, {
//           headers: {
//             Authorization: Bearer `${localStorage.getItem('accessToken')}`,
//           },
//         });
//       } else {
//         await axios.post(`${BASE_URL}/api/users/`, formData, {
//           headers: {
//             Authorization: Bearer `${localStorage.getItem('accessToken')}`,
//           },
//         });
//       }
//       setFormData({});
//       fetchUsers();
//       setShowUpdateModal(false);
//       setSelectedUser(null);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   const updateUser = (user) => {
//     setFormData({
//       id: user.id,
//       username: user.username,
//       password: user.password,
//       email:user.email,
//       is_active: user.is_active
//     });
//     setSelectedUser(user);
//     setShowUpdateModal(true);
//   };

//   const deactivateUser = async (userId) => {
//     try {
//       await axios.delete(`${BASE_URL}/api/users/${userId}/`, {
//         headers: {
//           Authorization: Bearer `${localStorage.getItem('accessToken')}`,
//         },
//       });
//       fetchUsers();
//     } catch (error) {
//       console.error('Error deactivating user:', error);
//     }
//   };

//   const handleAddNewUser = () => {
//     setShowUpdateModal(true);
//     setFormData({});
//     setSelectedUser(null);
//   };

//   const handleCloseModal = () => {
//     setShowUpdateModal(false);
//     setSelectedUser(null);
//     fetchUsers();
//   };

//   const handleAddNewAdminUser = () => {
//     setShowAddModal(true);
//     setFormData({});
//     setSelectedUser(null);
//   };

//   const handleSubmitAddAdminUser = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${BASE_URL}/api/admin/`, formData, {
//         headers: {
//           Authorization: Bearer `${localStorage.getItem('accessToken')}`,
//         },
//       });
//       setFormData({});
//       fetchUsers();
//       setShowAddModal(false);
//       setSelectedUser(null);
//     } catch (error) {
//       console.error('Error adding admin user:', error);
//     }
//   };

//   return (
//     <div className="user-container" style={{ textAlign: 'center' }}>
//       <div className="user-list">
//         <h2> User Details</h2>
//         <TableContainer component={Paper} style={{ minWidth: '700px' }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Username</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Action</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {users.map((user) => (
//                 <TableRow key={user.id} style={{ height: '60px' }}>
//                   <TableCell>{user.username}</TableCell>
//                   <TableCell>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
//                   <TableCell>
//                     <Button onClick={() => deactivateUser(user.id)}>Deactivate</Button>
//                     <Button onClick={() => updateUser(user)}>Update</Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>

//       <div className="user-form">
//         {!showUpdateModal && !selectedUser && (
//           <Button variant="contained" color="primary" onClick={handleAddNewUser}>
//             Add New User
//           </Button>
//         )}

//         {showUpdateModal && (
//           <Modal open={showUpdateModal} onClose={handleCloseModal} style={{ marginTop: '50px' }}>
//             <Paper className="update-modal">
//               <Container maxWidth="sm">
//                 <Typography variant="h5">
//                   {selectedUser ? 'Update User' : 'Add New User'}
//                 </Typography>
//                 <form onSubmit={handleSubmit}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12}>
//                       <TextField
//                         label="Username"
//                         fullWidth
//                         value={formData.username || ''}
//                         onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                       />
//                     </Grid>

//                     <Grid item xs={12}>
//                       <TextField
//                         label="Email"
//                         fullWidth
//                         value={formData.email || ''}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         label="Password"
//                         type="password"
//                         fullWidth
//                         value={formData.password || ''}
//                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                       />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <TextField
//                         label="is_active"
//                         fullWidth
//                         value={formData.is_active || ''}
//                         onChange={(e) => setFormData({ ...formData, is_active: e.target.value })}
//                       />
//                     </Grid>
//                   </Grid>
//                   <Button variant="contained" color="success" type="submit">
//                     Submit
//                   </Button>
//                   <Button variant="contained" color="primary" onClick={handleCloseModal}>
//                     Close
//                   </Button>
//                 </form>
//               </Container>
//             </Paper>
//           </Modal>
//         )}

//         {!showUpdateModal && !selectedUser && (
//           <Button variant="contained" color="primary" onClick={handleAddNewAdminUser}>
//             Add New Admin User
//           </Button>
//         )}

//         <Modal open={showAddModal} onClose={() => setShowAddModal(false)} style={{ marginTop: '50px' }}>
//           <Paper className="add-admin-modal">
//             <Container maxWidth="sm">
//               <Typography variant="h5">Add Admin User</Typography>
//               <form onSubmit={handleSubmitAddAdminUser}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12}>
//                     <TextField
//                       label="Username"
//                       fullWidth
//                       value={formData.username || ''}
//                       onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                     />
//                   </Grid>

//                   <Grid item xs={12}>
//                     <TextField
//                       label="Email"
//                       fullWidth
//                       value={formData.email || ''}
//                       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       label="Password"
//                       type="password"
//                       fullWidth
//                       value={formData.password || ''}
//                       onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     />
//                   </Grid>
                 
//                   <Grid item xs={12}>
//                     <TextField
//                       label="is_staff"
//                       fullWidth
//                       value={formData.is_staff || ''}
//                       onChange={(e) => setFormData({ ...formData, is_staff: e.target.value })}
//                     />
//                   </Grid>
//                 </Grid>
//                 <Button variant="contained" color="primary" type="submit">
//                   Add Admin User
//                 </Button>
//               </form>
//               <Button variant="contained" color="secondary" onClick={() => setShowAddModal(false)}>
//                 Close
//               </Button>
//             </Container>
//           </Paper>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default User;