
// src/components/EmployeeList.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './EmployeeList.css'; // Ensure this CSS file exists

const API_BASE_URL = 'http://localhost:5000/api';

const EmployeeList = ({ employees, fetchEmployees }) => {
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editExperienceYears, setEditExperienceYears] = useState('');

  // Function to handle employee deletion
  const deleteEmployee = async (employeeId) => {
    if (!employeeId) {
      alert('Error: Employee ID is missing for deletion.');
      console.error('Attempted to delete employee with undefined ID.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete employee with ID: ${employeeId}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/employees/${employeeId}`);
      alert(`Employee with ID ${employeeId} deleted successfully.`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || 'Failed to delete employee.');
      } else {
        alert('Failed to delete employee. Network error or unknown issue.');
      }
    }
  };

  // Function to initiate editing for an employee
  const startEditEmployee = (employee) => {
    if (!employee || !employee.employee_id) {
      alert('Error: Cannot edit employee. Employee ID is missing.');
      console.error('Attempted to start edit for employee with missing ID:', employee);
      return;
    }
    setEditingEmployee(employee);
    setEditName(employee.name);
    setEditSalary(employee.current_salary != null ? employee.current_salary.toString() : '');
    setEditPhone(employee.phone || '');
    setEditAddress(employee.address || '');
    setEditExperienceYears(employee.experience_years != null ? employee.experience_years.toString() : '');
  };

  // Function to submit edited employee data
  const updateEmployee = async (e) => {
    e.preventDefault();
    if (!editingEmployee || !editingEmployee.employee_id || !editName || !editSalary || !editExperienceYears) {
      alert('Please fill in all required fields for editing, and ensure employee ID is present.');
      return;
    }

    try {
      const updatedData = {
        name: editName,
        current_salary: parseFloat(editSalary),
        phone: editPhone.trim() === '' ? null : editPhone.trim(),
        address: editAddress.trim() === '' ? null : editAddress.trim(),
        experience_years: parseInt(editExperienceYears, 10)
      };

      await axios.put(`${API_BASE_URL}/employees/${editingEmployee.employee_id}`, updatedData);
      alert(`Employee with ID ${editingEmployee.employee_id} updated successfully!`);

      setEditingEmployee(null);
      setEditName('');
      setEditSalary('');
      setEditPhone('');
      setEditAddress('');
      setEditExperienceYears('');
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || 'Failed to update employee.');
      } else {
        alert('Failed to update employee. Network error or unknown issue.');
      }
    }
  };

  return (
    <div className="employee-list-container">
      <h2>Employee List</h2>
      {!(Array.isArray(employees) && employees.length > 0) ? (
        <p>No employees found.</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Salary</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Experience (Years)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employee_id || `employee-${employee.name}-${Math.random()}`}>
                <td>{employee.employee_id || 'N/A'}</td><td>{employee.name}</td><td>
                  {employee.current_salary != null && !isNaN(employee.current_salary)
                    ? `$${parseFloat(employee.current_salary).toFixed(2)}`
                    : 'N/A'}
                </td><td>{employee.phone || 'N/A'}</td><td>{employee.address || 'N/A'}</td><td>
                  {employee.experience_years != null && !isNaN(employee.experience_years)
                    ? employee.experience_years
                    : 'N/A'}
                </td><td>
                  <button onClick={() => startEditEmployee(employee)} className="edit-button">Edit</button>
                  <button onClick={() => deleteEmployee(employee.employee_id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Employee Edit Form */}
      {editingEmployee && (
        <div className="edit-employee-form">
          <h3>Edit Employee: {editingEmployee.name}</h3>
          <form onSubmit={updateEmployee}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Salary:</label>
              <input
                type="number"
                value={editSalary}
                onChange={(e) => setEditSalary(e.target.value)}
                required
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Experience (Years):</label>
              <input
                type="number"
                value={editExperienceYears}
                onChange={(e) => setEditExperienceYears(e.target.value)}
                required
                min="0"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">Save Changes</button>
              <button type="button" onClick={() => setEditingEmployee(null)} className="cancel-button">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;