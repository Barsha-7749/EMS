// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import EmployeeRegistrationForm from './components/EmployeeRegistrationForm';
import EmployeeList from './components/EmployeeList';
import HrPolicy from './components/HrPolicy';
import CalculateIncrement from './components/CalculateIncrement';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [hrPolicies, setHrPolicies] = useState([]);

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      alert('Failed to load employee list.');
    }
  };

  // Fetch HR Policies
  const fetchHrPolicies = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/hr-policies`);
      setHrPolicies(res.data);
    } catch (err) {
      console.error('Error fetching HR policies:', err);
      alert('Failed to load HR policies.');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchHrPolicies();
  }, []);

  // Add Employee
  const addEmployee = async (newEmployee, onSuccess) => {
    try {
      await axios.post(`${API_BASE_URL}/employees`, newEmployee);
      alert('Employee Registered Successfully!');
      fetchEmployees();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error adding employee:', err);
      if (axios.isAxiosError(err) && err.response) {
        console.error('Server response data:', err.response.data);
        alert(err.response.data.message || 'Failed to register employee. Check console for details.');
      } else {
        alert('Network or unknown error occurred.');
      }
    }
  };

  // Add HR Policy
  const addHrPolicy = async (newPolicy) => {
    try {
      await axios.post(`${API_BASE_URL}/hr-policies`, newPolicy);
      alert('HR Policy Added Successfully!');
      fetchHrPolicies();
    } catch (err) {
      console.error('Error adding HR policy:', err);
      if (axios.isAxiosError(err) && err.response) {
        console.error('Server response data:', err.response.data);
        alert(err.response.data.message || 'Failed to add HR policy. Check console for details.');
      } else {
        alert('Network or unknown error occurred.');
      }
    }
  };

  // Delete HR Policy
  const deleteHrPolicy = async (policyId) => {
    // ⭐ FIX: Add check for valid policyId before proceeding
    if (!policyId) {
      alert('Error: Policy ID is missing for deletion.');
      console.error('Attempted to delete HR policy with undefined ID.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this HR policy?')) {
      return; // User cancelled
    }
    try {
      await axios.delete(`${API_BASE_URL}/hr-policies/${policyId}`);
      alert('HR Policy Deleted Successfully!');
      fetchHrPolicies();
    } catch (err) {
      console.error('Error deleting HR policy:', err);
      if (axios.isAxiosError(err) && err.response) {
        console.error('Server response data:', err.response.data);
        alert(err.response.data.message || 'Failed to delete HR policy. Check console for details.');
      } else {
        alert('Network or unknown error occurred.');
      }
    }
  };

  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<EmployeeRegistrationForm addEmployee={addEmployee} />} />
          <Route path="/employees" element={<EmployeeList employees={employees} fetchEmployees={fetchEmployees} />} />
          <Route
            path="/hr-policies"
            element={<HrPolicy hrPolicies={hrPolicies} addHrPolicy={addHrPolicy} deleteHrPolicy={deleteHrPolicy} />}
          />
          <Route path="/calculate-increment" element={<CalculateIncrement employees={employees} hrPolicies={hrPolicies} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;