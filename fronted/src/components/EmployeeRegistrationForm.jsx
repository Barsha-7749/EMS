// src/components/EmployeeRegistrationForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeRegistrationForm.css';

const EmployeeRegistrationForm = ({ addEmployee }) => {
  // State for form data. employee_id is now included as per request.
  const [formData, setFormData] = useState({
    employee_id: '', // Re-added employee_id to state
    name: '',
    phone: '',
    address: '',
    current_salary: '',
    experience_years: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      employee_id, // Destructure employee_id
      name,
      phone,
      address,
      current_salary,
      experience_years
    } = formData;

    // --- CRITICAL VALIDATION ---
    // Validate that all required fields have a value.
    // employee_id is now required as it's being sent from the form.
    if (
      !employee_id.trim() || // Validate employee_id
      !name.trim() ||
      !current_salary ||
      experience_years === ''
    ) {
      alert('Please fill in all required fields: ID, Name, Salary, and Experience.');
      return;
    }

    // Parse and validate numeric fields before submission.
    const parsedExperienceYears = parseInt(experience_years, 10);
    if (isNaN(parsedExperienceYears) || parsedExperienceYears < 0) {
      alert('Please enter a valid non-negative number for Experience (years).');
      return;
    }

    const parsedCurrentSalary = parseFloat(current_salary);
    if (isNaN(parsedCurrentSalary) || parsedCurrentSalary <= 0) {
      alert('Please enter a valid positive number for Salary.');
      return;
    }

    // Prepare data to send to the parent component or backend.
    const cleanedData = {
      employee_id: employee_id.trim(), // Include employee_id in cleanedData
      name: name.trim(),
      phone: phone.trim() === '' ? null : phone.trim(),
      address: address.trim() === '' ? null : address.trim(),
      current_salary: parsedCurrentSalary,
      experience_years: parsedExperienceYears
    };

    // Call the addEmployee function passed from the parent component (e.g., App.jsx)
    addEmployee(cleanedData, () => {
      // On success, reset form fields to their initial state.
      setFormData({
        employee_id: '', // Reset employee_id field
        name: '',
        phone: '',
        address: '',
        current_salary: '',
        experience_years: ''
      });
      // Navigate to the employee list page after successful registration.
      navigate('/employees');
    });
  };

  return (
    <div className="registration-form-container">
      <h2>Employee Registration</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        {/* Employee ID input is now included */}
        <div className="form-group">
          <label htmlFor="employee_id">Employee ID:</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="e.g., EMP001"
            required // employee_id is required if manually assigned
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number (Optional):</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g., +91 9876543210"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address (Optional):</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="experience_years">Experience (Years):</label>
          <input
            type="number"
            id="experience_years"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            placeholder="e.g., 2"
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="current_salary">Salary (INR):</label>
          <input
            type="number"
            id="current_salary"
            name="current_salary"
            value={formData.current_salary}
            onChange={handleChange}
            placeholder="e.g., 50000"
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <button type="submit" className="submit-button">Register Employee</button>
      </form>
    </div>
  );
};

export default EmployeeRegistrationForm;