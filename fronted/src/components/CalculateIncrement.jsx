// src/components/CalculateIncrement.jsx (Ensure this is the version you are using)
import React from 'react';
import './CalculateIncrement.css';

const CalculateIncrement = ({ employees, hrPolicies }) => {
  // ⭐ IMPORTANT: Defensive checks for props
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const safeHrPolicies = Array.isArray(hrPolicies) ? hrPolicies : [];

  const getIncrementDetailsForEmployee = (employee) => {
    const employeeExperience = employee.experience_years;
    let foundPolicy = null;

    // Use safeHrPolicies for iteration
    for (const policy of safeHrPolicies) {
      const range = policy.experience_range;
      if (range.includes('-')) {
        const [minStr, maxStr] = range.split('-').map(s => s.trim().replace(' years', ''));
        const minExp = parseInt(minStr, 10); // Added radix 10
        const maxExp = parseInt(maxStr, 10); // Added radix 10
        if (employeeExperience >= minExp && employeeExperience <= maxExp) {
          foundPolicy = policy;
          break;
        }
      } else if (range.includes('+')) {
        const minExp = parseInt(range.replace('+', '').replace(' years', ''), 10); // Added radix 10
        if (employeeExperience >= minExp) {
          foundPolicy = policy;
          break;
        }
      }
    }

    if (foundPolicy) {
      const incrementPercentage = foundPolicy.increment_percentage;
      // Defensive check for current_salary before calculation
      const currentSalary = employee.current_salary != null && !isNaN(employee.current_salary)
        ? parseFloat(employee.current_salary)
        : 0; // Default to 0 or handle as an error case

      const incrementAmount = (currentSalary * incrementPercentage) / 100;
      const newSalary = currentSalary + incrementAmount;

      return {
        employeeName: employee.name,
        currentSalary: currentSalary,
        employeeExperience: employeeExperience,
        policyCategory: foundPolicy.category,
        policyExperienceRange: foundPolicy.experience_range,
        incrementPercentage: incrementPercentage,
        incrementAmount: incrementAmount,
        newSalary: newSalary,
        eligibility: foundPolicy.eligibility
      };
    } else {
      return null;
    }
  };

  return (
    <div className="calculate-increment-container">
      <h2>Employee Increment Calculation</h2>

      {/* Use safeEmployees and safeHrPolicies for conditional rendering */}
      {safeEmployees.length === 0 ? (
        <p className="no-data-message">No employees registered to calculate increments for.</p>
      ) : safeHrPolicies.length === 0 ? (
        <p className="no-data-message">No HR policies defined. Please add policies to calculate increments.</p>
      ) : (
        <div className="table-responsive">
          <table className="increment-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Experience (Years)</th>
                <th>Current Salary</th>
                <th>Matched Policy Category</th>
                <th>Matched Policy Range</th>
                <th>Increment (%)</th>
                <th>Increment Amount</th>
                <th>New Salary</th>
                <th>Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {/* Use safeEmployees for mapping */}
              {safeEmployees.map(employee => {
                // Defensive check for employee_id before using as key
                const key = employee.employee_id || `${employee.name}-${employee.experience_years}-${Math.random()}`; // Added random for stronger fallback
                const incrementDetails = getIncrementDetailsForEmployee(employee);
                return (
                  <tr key={key}>
                    <td>{employee.name}</td>
                    <td>{employee.experience_years != null && !isNaN(employee.experience_years) ? employee.experience_years : 'N/A'}</td>
                    <td>
                      {employee.current_salary != null && !isNaN(employee.current_salary)
                        ? `₹${parseFloat(employee.current_salary).toFixed(2)}`
                        : 'N/A'}
                    </td>
                    {incrementDetails ? (
                      <>
                        <td>{incrementDetails.policyCategory}</td>
                        <td>{incrementDetails.policyExperienceRange}</td>
                        <td>{incrementDetails.incrementPercentage}%</td>
                        <td>₹{incrementDetails.incrementAmount.toFixed(2)}</td>
                        <td>₹{incrementDetails.newSalary.toFixed(2)}</td>
                        <td>{incrementDetails.eligibility || 'N/A'}</td>
                      </>
                    ) : (
                      <td colSpan="6" className="no-policy-match-cell">
                        No HR policy matches for this employee's experience.
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CalculateIncrement;