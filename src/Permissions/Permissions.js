import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select
} from '@material-ui/core';
import BASE_URL from '../config';
import './Permissions.css';

const Permissions = () => {
  const [employeePermissions, setEmployeePermissions] = useState([]);
  const [timeCyclePermissions, setTimeCyclePermissions] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [showUserRoleDialog, setShowUserRoleDialog] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployeePermissions();
    fetchTimeCyclePermissions();
    fetchUserRoles();
  }, []);

  const fetchEmployeePermissions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/employee-permissions/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setEmployeePermissions(response.data.employee_permissions);
    } catch (error) {
      console.error('Error fetching employee permissions:', error);
    }
  };

  const fetchTimeCyclePermissions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/timecycle-permissions/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setTimeCyclePermissions(response.data.time_cycle_permissions);
    } catch (error) {
      console.error('Error fetching time cycle permissions:', error);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user-roles/all/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setUserRoles(response.data);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const fetchRolePermissions = async (groupPk) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/userrole-permission/${groupPk}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setRolePermissions(response.data); // Assuming the API response contains role permissions
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const handleUserRoleSelection = (groupPk, roleName) => {
    setSelectedUserRole(roleName);
    fetchRolePermissions(groupPk); // Fetch permissions for the selected user role
  };

  const handleAddPermission = async (permissionId, userRoleId) => {
    try {
      await axios.post(
        `${BASE_URL}/api/userrole-permission/${userRoleId}/${permissionId}/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      // After adding permission, refresh role permissions for the selected user role
      fetchRolePermissions(userRoleId);
      fetchEmployeePermissions();
      fetchTimeCyclePermissions();
      // fetchUserRoles();
    } catch (error) {
      console.error('Error adding permission to user role:', error);
    } finally {
      // Close the modal after handling the action
      setIsAddModalOpen(false);
    }
  };

  const handleDeletePermission = async (permissionId, userRoleId) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/userrole-permission/${userRoleId}/${permissionId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      // After deleting permission, refresh role permissions for the selected user role
      fetchRolePermissions(userRoleId);
      fetchEmployeePermissions();
      fetchTimeCyclePermissions();
      // fetchUserRoles();
    } catch (error) {
      console.error('Error deleting permission from user role:', error);
    }
  };

  const handleAddButtonClick = (permission) => {
    setSelectedPermission(permission);
    setShowUserRoleDialog(true);
    setShowAddForm(!showAddForm);
    setShowDeleteForm(false);
    // Open the modal when the "Add" button is clicked
    setIsAddModalOpen(true);
  };

  const handleDeleteButtonClick = (permission) => {
    setSelectedPermission(permission);
    setShowUserRoleDialog(true);
    setShowDeleteForm(!showDeleteForm);
    setShowAddForm(false);
  };

  const handleCloseAddModal = () => {
    // Close the modal when the "Cancel" button is clicked
    setIsAddModalOpen(false);
  };

  return (



<div className="permissions-container" style={{ marginTop: '20px', marginLeft: '20px' }}>
      {/* User Roles */}
      <div className="user-role-permissions">
        <h2 style={{ margin: '-5px -5px' }}>User Roles</h2>
        <table className="role-table" style={{ margin: '10px -25px' }}>
          <thead>
            <tr>
              <th>Role Name</th>
            </tr>
          </thead>
          <tbody>
            {userRoles.map((role) => (
              <tr key={role.id}>
                <td>
                  <Button variant="outlined" color="error" onClick={() => handleUserRoleSelection(role.id, role.name)}>
                    {role.name}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Role Permissions */}
        {selectedUserRole && (
          <div className="role-permissions">
            <h3>{`Permissions for ${selectedUserRole}`}</h3>
            <table className="permission-table">
              <thead>
                <tr>
                  <th>Codename</th>
                  <th>Permission</th>
                </tr>
              </thead>
              <tbody>
                {rolePermissions.map((permission) => (
                  <tr key={permission.id}>
                    <td>{permission.codename}</td>
                    <td>{permission.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Employee Permissions */}
      <div>
        <h2 style={{ margin: '20px 45px' }}>Employee Permissions</h2>
        <table className="permissions-table" style={{ margin: '20px 45px' }}>
          <thead>
            <tr>
              <th>Permission</th>
              <th>Add</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {employeePermissions.map((permission) => (
              <tr key={permission.id} className="permission-item">
                <td>{`${permission.codename} - ${permission.name}`}</td>
                <td>
                  <Button variant="contained" color="primary" onClick={() => handleAddButtonClick(permission)}>
                    Add
                  </Button>
                </td>
                <td>
                  <Button variant="contained" color="error" onClick={() => handleDeleteButtonClick(permission)}>
                    Delete
                  </Button>
                </td>
                {/* Modals */}
                {showAddForm && selectedPermission?.id === permission.id && (
                  <Dialog open={showUserRoleDialog} onClose={() => setShowUserRoleDialog(false)}>
                    <DialogTitle>Select User Role</DialogTitle>
                    <DialogContent>
                      <form>
                        <TextField
                          select
                          label="User Role"
                          fullWidth
                          value={selectedUserRole}
                          onChange={(e) => setSelectedUserRole(e.target.value)}
                        >
                          <MenuItem value="">Select User Role</MenuItem>
                          {userRoles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </form>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowUserRoleDialog(false)} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={() => handleAddPermission(selectedPermission?.id, selectedUserRole)} color="primary">
                        Add
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}

                {showDeleteForm && selectedPermission?.id === permission.id && (
                  <Dialog open={showUserRoleDialog} onClose={() => setShowUserRoleDialog(false)}>
                    <DialogTitle>Select User Role to Delete</DialogTitle>
                    <DialogContent>
                      <form>
                        <TextField
                          select
                          label="User Role"
                          fullWidth
                          value={selectedUserRole}
                          onChange={(e) => setSelectedUserRole(e.target.value)}
                        >
                          <MenuItem value="">Select User Role</MenuItem>
                          {userRoles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </form>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowUserRoleDialog(false)} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={() => handleDeletePermission(selectedPermission?.id, selectedUserRole)} color="primary">
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Time Cycle Permissions */}
      <div>
        <h2 style={{ margin: '20px 85px' }}>Time Cycle Permissions</h2>
        <table className="permissions-table" style={{ margin: '20px 85px' }}>
          <thead>
            <tr>
              <th>Permission</th>
              <th>Add</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {timeCyclePermissions.map((permission) => (
              <tr key={permission.id} className="permission-item">
                <td>{`${permission.codename} - ${permission.name}`}</td>
                <td>
                  <Button variant="contained" color="primary" onClick={() => handleAddButtonClick(permission)}>
                    Add
                  </Button>
                </td>
                <td>
                  <Button variant="contained" color="error" onClick={() => handleDeleteButtonClick(permission)}>
                    Delete
                  </Button>
                </td>
                {/* Modals */}
                {showAddForm && selectedPermission?.id === permission.id && (
                  <Dialog open={showUserRoleDialog} onClose={() => setShowUserRoleDialog(false)}>
                    <DialogTitle>Select User Role</DialogTitle>
                    <DialogContent>
                      <form>
                        <TextField
                          select
                          label="User Role"
                          fullWidth
                          value={selectedUserRole}
                          onChange={(e) => setSelectedUserRole(e.target.value)}
                        >
                          <MenuItem value="">Select User Role</MenuItem>
                          {userRoles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </form>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowUserRoleDialog(false)} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={() => handleAddPermission(selectedPermission?.id, selectedUserRole)} color="primary">
                        Add
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}

                {showDeleteForm && selectedPermission?.id === permission.id && (
                  <Select onChange={(e) => handleDeletePermission(permission.id, e.target.value)}>
                    <MenuItem value="">Select User Role</MenuItem>
                    {userRoles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Permission Modal */}
      <Dialog open={isAddModalOpen} onClose={handleCloseAddModal}>
        <DialogTitle>Add Permission</DialogTitle>
        <DialogContent>
          {/* Add your content here */}
          {/* Example: */}
          <p>Are you sure you want to add this permission?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleAddPermission(selectedPermission?.id, selectedUserRole)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Permissions;
