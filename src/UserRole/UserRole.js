import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button,Form,Modal } from 'react-bootstrap';
import './UserRole.css';
import BASE_URL from '../config';

const UserRoleComponent = () => {
  const [userRoles, setUserRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [usersInRole, setUsersInRole] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [isUserRoleClicked, setIsUserRoleClicked] = useState(false);

  useEffect(() => {
    fetchUserRoles();
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    // Fetch available users when the selected role changes
    if (selectedRole) {
      fetchAvailableUsers();
    }
  }, [selectedRole]);


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

  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/users/all/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setAvailableUsers(response.data);
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  const handleRoleSelection = async (roleId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user-roles/${roleId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setUsersInRole(response.data);
      setSelectedRole(roleId);
      // Set the selected user role
      const selectedRole = userRoles.find(role => role.id === roleId);
      setSelectedUserRole(selectedRole);
      
    } catch (error) {
      console.error('Error fetching users in role:', error);
    }
  };

  const handleAddUserRole = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/user-roles/create/`,
        { name: newRoleName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setUserRoles([...userRoles, response.data]);
      setNewRoleName('');
      // Fetch user roles again to update the list
      fetchUserRoles();
    } catch (error) {
      console.error('Error creating user role:', error);
    }
  };

  const handleAddUserToRole = async () => {
    try {
      
      fetchAvailableUsers();
      // After setting available users, show the add user form
      setShowAddUserForm(true);
  
      // Other logic remains the same
      await axios.put(
        `${BASE_URL}/api/user-to-userrole/${selectedUser}/${selectedRole}/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      handleRoleSelection(selectedRole);
      
    } catch (error) {
      console.error('Error adding user to role:', error);
    }
  };
  
  


  const handleRemoveUserFromRole = async (userId) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/user-to-userrole/${userId}/${selectedRole}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      // Refresh users in the selected role
      handleRoleSelection(selectedRole);
    } catch (error) {
      console.error('Error removing user from role:', error);
    }
  };

  return (
    <div className='container'>
      {/* Form to add new user role */}
      <input 
        type="text"
        placeholder="New Role Name"
        value={newRoleName}
        onChange={(e) => setNewRoleName(e.target.value)}
      />
      <button onClick={handleAddUserRole}>Add User Role</button>

      {/* List of user roles */}
      <div className="user-role-list">
  <h5>User Role List</h5>
  <table className="role-table">
    <thead>
      <tr>
        <th>Role Name</th>
      </tr>
    </thead>
    <tbody>
      {userRoles.map(role => (
        <tr key={role.id} onClick={() => handleRoleSelection(role.id)}>
          <td>{role.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      

      {/* Display selected user role name */}
      {selectedUserRole && (
        <div>
          <h5>Users in {selectedUserRole.name}</h5>
        </div>
      )}

      {/* List of users in selected role */}
      {selectedRole && (
        <ul>
          {usersInRole.map((user) => (
            <li key={user.id}>
              {user.username}
              <button onClick={() => handleRemoveUserFromRole(user.id)}>
                Remove User
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Form to add user to selected role */}

      {selectedRole && (
        
  <div>
    {/* Button to open modal */}
    <Button variant="primary" onClick={() => setShowAddUserForm(true)}>
      Add User to Role
    </Button>
   
    {/* Modal for user selection */}
    <Modal show={showAddUserForm} onHide={() => setShowAddUserForm(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Select User to Add</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      
        {/* Dropdown for available users */}
        <Form.Control
          as="select"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </Form.Control>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAddUserForm(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddUserToRole}>
          Add User
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
)}
      
    </div>
  );
};

export default UserRoleComponent;

