import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Container,
  Grid,
  Typography,
} from '@material-ui/core';
import BASE_URL from '../config';
import './Employee.css';

const EmployeeComponent = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employee_name: '',
    email: '',
    contact_no: '',
    address: '',
    designation: '',
    is_active: '',
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/employees/all/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const createEmployee = async () => {
    try {
      await axios.post(`${BASE_URL}/api/employees/`, newEmployee, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setNewEmployee({
        employee_name: '',
        email: '',
        contact_no: '',
        address: '',
        designation: '',
        is_active: '',
      });
      setShowAddModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`${BASE_URL}/api/employees/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const updateEmployee = async () => {
    try {
      await axios.put(`${BASE_URL}/api/employees/${selectedEmployee.id}/`, selectedEmployee, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setShowUpdateModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const viewEmployeeDetails = async (employeeId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/employees/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setSelectedEmployee(response.data);
      setShowEmployeeDetailsModal(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const editEmployee = () => {
    setShowEmployeeDetailsModal(false);
    setShowUpdateModal(true);
  };

  return (
    <div className="employee-container" style={{ marginLeft: '250px' }}>
      {/* Add New Employee Button */}
      <Button className="add-employee-button" variant="contained" color="primary" onClick={() => setShowAddModal(true)}>
        Add Employee
      </Button>

      {/* Add New Employee Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} style={{ marginTop: '100px' }}>
        <Paper>
          <Container maxWidth="sm">
            <Typography variant="h5">Add New Employee</Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Employee Name"
                    fullWidth
                    value={newEmployee.employee_name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employee_name: e.target.value })}
                    placeholder="Enter employee name"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email "
                    fullWidth
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    placeholder="Enter Email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Contact Numbere"
                    fullWidth
                    value={newEmployee.contact_no}
                    onChange={(e) => setNewEmployee({ ...newEmployee, contact_no: e.target.value })}
                    placeholder="Enter Contact Number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    fullWidth
                    value={newEmployee.address}
                    onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                    placeholder="Enter Address"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Designation "
                    fullWidth
                    value={newEmployee.designation}
                    onChange={(e) => setNewEmployee({ ...newEmployee, designation: e.target.value })}
                    placeholder="Enter Designation"
                  />
                </Grid>
              
                <Grid item xs={12}>
                  <TextField
                    label="IsActive"
                    type="boolean"
                    fullWidth
                    value={newEmployee.is_active}
                    onChange={(e) => setNewEmployee({ ...newEmployee, is_active: e.target.value })}
                    placeholder="Enter active status"
                  />
                </Grid>
                {/* Additional form inputs */}
              </Grid>
              <Button variant="contained" color="secondary" onClick={() => setShowAddModal(false)}>
                Close
              </Button>
              <Button variant="contained" color="primary" onClick={createEmployee}>
                Add Employee
              </Button>
            </form>
          </Container>
        </Paper>
      </Modal>

      {/* Employee List */}
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.employee_name}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="dark" onClick={() => viewEmployeeDetails(employee.id)}>
                      View Details
                    </Button>
                    <Button variant="outlined" color="danger" onClick={() => deleteEmployee(employee.id)}>
                      Deactivate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Employee Details Modal */}
      <Modal open={showEmployeeDetailsModal} onClose={() => setShowEmployeeDetailsModal(false)} style={{ marginTop: '100px' }}>
        <Paper>
          <Container maxWidth="sm">
            <Typography variant="h5">Employee Details</Typography>
            <p>Name: {selectedEmployee?.employee_name}</p>
            <p>Email:{selectedEmployee?.email}</p>
            <p>Contact_No: {selectedEmployee?.contact_no}</p>
            <p>Address:{selectedEmployee?.address}</p>
            <p>Designation:{selectedEmployee?.designation}</p>
            <p>Status:{selectedEmployee?.is_active ? 'Active' :'Inactive'}</p>
            {/* Display other details */}
            <Button variant="contained" color="secondary" onClick={() => setShowEmployeeDetailsModal(false)}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={editEmployee}>
              Edit
            </Button>
          </Container>
        </Paper>
      </Modal>

      {/* Update Employee Modal */}
      <Modal open={showUpdateModal} onClose={() => setShowUpdateModal(false)} style={{ marginTop: '100px' }}>
        <Paper>
          <Container maxWidth="sm">
            <Typography variant="h5">Update Employee</Typography>
            <form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Employee Name"
                    fullWidth
                    value={selectedEmployee?.employee_name || ''}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, employee_name: e.target.value })}
                    placeholder="Enter employee name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email "
                    fullWidth
                    value={selectedEmployee?.email || ''}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                    placeholder="Enter Email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Contact Numbere"
                    fullWidth
                    value={selectedEmployee?.contact_no}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, contact_no: e.target.value })}
                    placeholder="Enter Contact Number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    fullWidth
                    value={selectedEmployee?.address}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, address: e.target.value })}
                    placeholder="Enter Address"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Designation "
                    fullWidth
                    value={selectedEmployee?.designation}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, designation: e.target.value })}
                    placeholder="Enter Designation"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Status"
                    type="checkbox"
                    checked={selectedEmployee?.is_active}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, is_active: e.target.checked })}
                  />
                </Grid>
              </Grid>
              <Button variant="contained" color="secondary" onClick={() => setShowUpdateModal(false)}>
                Close
              </Button>
              <Button variant="contained" color="primary" onClick={updateEmployee}>
                Update Employee
              </Button>
            </form>
          </Container>
        </Paper>
      </Modal>
    </div>
  );
};

export default EmployeeComponent;





