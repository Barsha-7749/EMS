// src/components/HrPolicy.jsx
import React, { useState } from 'react';
import './HrPolicy.css';

const HrPolicy = ({ hrPolicies, addHrPolicy, deleteHrPolicy }) => {
  const [formData, setFormData] = useState({
    category: '',
    experience_range: '',
    increment_percentage: '',
    eligibility: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { category, experience_range, increment_percentage } = formData;

    if (
      !category.trim() ||
      !experience_range.trim() ||
      increment_percentage === '' ||
      isNaN(parseFloat(increment_percentage)) ||
      parseFloat(increment_percentage) < 0
    ) {
      alert('Please enter a valid category, experience range, and a positive increment percentage.');
      return;
    }

    addHrPolicy({
      ...formData,
      category: category.trim(),
      experience_range: experience_range.trim(),
      increment_percentage: parseFloat(increment_percentage),
      eligibility: formData.eligibility ? formData.eligibility.trim() : null
    });

    setFormData({
      category: '',
      experience_range: '',
      increment_percentage: '',
      eligibility: ''
    });
  };

  return (
    <div className="hr-policy-container">
      <h2>HR Policy Management</h2>

      <div className="policy-form-section">
        <h3>Add New Policy Rule</h3>
        <form onSubmit={handleSubmit} className="policy-form">
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              <option value="Junior">Junior</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience_range">Experience Range:</label>
            <select
              id="experience_range"
              name="experience_range"
              value={formData.experience_range}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Experience Range --</option>
              <option value="0-2 years">0-2 years</option>
              <option value="2-5 years">2-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="increment_percentage">Increment Percentage (%):</label>
            <input
              type="number"
              step="0.01"
              id="increment_percentage"
              name="increment_percentage"
              value={formData.increment_percentage}
              onChange={handleChange}
              placeholder="e.g., 5.0, 8.5"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eligibility">Eligibility Criteria:</label>
            <textarea
              id="eligibility"
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              placeholder="e.g., Good performance review, completed certifications"
              rows="2"
            ></textarea>
          </div>

          <button type="submit" className="policy-submit-button">Add Policy</button>
        </form>
      </div>

      <div className="policy-list-section">
        <h3>Existing HR Policies</h3>
        {/* ⭐ Defensive check: Ensure hrPolicies is an array before checking length */}
        {!(Array.isArray(hrPolicies) && hrPolicies.length > 0) ? (
          <p className="no-policies-message">No HR policies defined yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="policy-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Experience Range</th>
                  <th>Increment (%)</th>
                  <th>Eligibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hrPolicies.map(policy => (
                  // ⭐ FIX 2: Ensure policy.policy_id is a valid key.
                  // If policy.policy_id is undefined/null, use a fallback key
                  <tr key={policy.policy_id || `policy-${policy.category}-${Math.random()}`}>
                    <td>{policy.category}</td>
                    <td>{policy.experience_range}</td>
                    <td>{policy.increment_percentage}%</td>
                    <td>{policy.eligibility || 'N/A'}</td>
                    <td>
                      {/* Pass policy.policy_id to deleteHrPolicy function */}
                      <button
                        className="action-button delete-policy"
                        onClick={() => deleteHrPolicy(policy.policy_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HrPolicy;