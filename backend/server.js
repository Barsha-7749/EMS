// employee-management-backend/server.js

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database!');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.send('Employee Management Backend is running!');
});

// --- EMPLOYEE ROUTES --- //

app.get('/api/employees', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT employee_id, name, phone, address, current_salary, experience_years FROM employees');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ message: 'Error fetching employees', error: err.message });
    }
});

app.post('/api/employees', async (req, res) => {
    const { employee_id, name, phone, address, current_salary, experience_years } = req.body;

    if (!employee_id || !name || current_salary == null || experience_years == null) {
        return res.status(400).json({ message: 'Missing required fields: employee_id, name, current_salary, experience_years.' });
    }
    if (isNaN(parseFloat(current_salary)) || parseFloat(current_salary) <= 0) {
        return res.status(400).json({ message: "Current salary must be a positive number." });
    }
    if (isNaN(parseInt(experience_years, 10)) || parseInt(experience_years, 10) < 0) {
        return res.status(400).json({ message: "Experience years must be a non-negative integer." });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO employees (employee_id, name, phone, address, current_salary, experience_years) VALUES (?, ?, ?, ?, ?, ?)',
            [employee_id, name, phone, address, current_salary, experience_years]
        );
        res.status(201).json({ message: 'Employee added successfully', employee_id });
    } catch (err) {
        console.error('Error adding employee:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `Employee with ID ${employee_id} already exists.` }); // ✅ Fixed missing backticks
        }
        res.status(500).json({ message: 'Error adding employee', error: err.message });
    }
});

app.get('/api/employees/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [employee_id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching employee by ID:', err);
        res.status(500).json({ message: 'Error fetching employee', error: err.message });
    }
});

app.put('/api/employees/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    const { name, phone, address, current_salary, experience_years } = req.body;

    if (!name && !phone && !address && current_salary == null && experience_years == null) {
        return res.status(400).json({ message: 'At least one field (name, phone, address, current_salary, or experience_years) is required for update.' });
    }
    if (current_salary != null && (isNaN(parseFloat(current_salary)) || parseFloat(current_salary) <= 0)) {
        return res.status(400).json({ message: "Current salary must be a positive number if provided." });
    }
    if (experience_years != null && (isNaN(parseInt(experience_years, 10)) || parseInt(experience_years, 10) < 0)) {
        return res.status(400).json({ message: "Experience years must be a non-negative integer if provided." });
    }

    try {
        const fields = [];
        const values = [];
        if (name !== undefined) { fields.push('name = ?'); values.push(name); }
        if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
        if (address !== undefined) { fields.push('address = ?'); values.push(address); }
        if (current_salary !== undefined) { fields.push('current_salary = ?'); values.push(current_salary); }
        if (experience_years !== undefined) { fields.push('experience_years = ?'); values.push(experience_years); }

        const query = `UPDATE employees SET ${fields.join(', ')} WHERE employee_id = ?`; // ✅ Fixed: Added backticks and quotes
        values.push(employee_id);

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found or no changes made' });
        }
        res.json({ message: 'Employee updated successfully' });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ message: 'Error updating employee', error: err.message });
    }
});

app.delete('/api/employees/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM employees WHERE employee_id = ?', [employee_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ message: 'Error deleting employee', error: err.message });
    }
});

// --- HR POLICY ROUTES --- //

app.get('/api/hr-policies', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT policy_id, category, experience_range, increment_percentage, eligibility FROM hr_policies');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching HR policies:', err);
        res.status(500).json({ message: 'Error fetching HR policies', error: err.message });
    }
});

app.post('/api/hr-policies', async (req, res) => {
    const { category, experience_range, increment_percentage, eligibility } = req.body;

    if (!category || !experience_range || increment_percentage == null) {
        return res.status(400).json({ message: 'Missing required fields: category, experience_range, increment_percentage.' });
    }
    if (isNaN(parseFloat(increment_percentage)) || parseFloat(increment_percentage) < 0) {
        return res.status(400).json({ message: "Increment percentage must be a non-negative number." });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO hr_policies (category, experience_range, increment_percentage, eligibility) VALUES (?, ?, ?, ?)',
            [category, experience_range, increment_percentage, eligibility]
        );
        res.status(201).json({ message: 'HR policy added successfully', policy_id: result.insertId });
    } catch (err) {
        console.error('Error adding HR policy:', err);
        res.status(500).json({ message: 'Error adding HR policy', error: err.message });
    }
});

app.get('/api/hr-policies/:policy_id', async (req, res) => {
    const { policy_id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM hr_policies WHERE policy_id = ?', [policy_id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'HR Policy not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching HR policy by ID:', err);
        res.status(500).json({ message: 'Error fetching HR policy', error: err.message });
    }
});

app.put('/api/hr-policies/:policy_id', async (req, res) => {
    const { policy_id } = req.params;
    const { category, experience_range, increment_percentage, eligibility } = req.body;

    if (!category && !experience_range && increment_percentage == null && eligibility == null) {
        return res.status(400).json({ message: 'At least one field is required for HR policy update.' });
    }
    if (increment_percentage != null && (isNaN(parseFloat(increment_percentage)) || parseFloat(increment_percentage) < 0)) {
        return res.status(400).json({ message: "Increment percentage must be a non-negative number if provided." });
    }

    try {
        const fields = [];
        const values = [];
        if (category !== undefined) { fields.push('category = ?'); values.push(category); }
        if (experience_range !== undefined) { fields.push('experience_range = ?'); values.push(experience_range); }
        if (increment_percentage !== undefined) { fields.push('increment_percentage = ?'); values.push(increment_percentage); }
        if (eligibility !== undefined) { fields.push('eligibility = ?'); values.push(eligibility); }

        const query = `UPDATE hr_policies SET ${fields.join(', ')} WHERE policy_id = ?`; // ✅ Fixed: Added backticks and quotes
        values.push(policy_id);

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'HR Policy not found or no changes made' });
        }
        res.json({ message: 'HR policy updated successfully' });
    } catch (err) {
        console.error('Error updating HR policy:', err);
        res.status(500).json({ message: 'Error updating HR policy', error: err.message });
    }
});

app.delete('/api/hr-policies/:policy_id', async (req, res) => {
    const { policy_id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM hr_policies WHERE policy_id = ?', [policy_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'HR Policy not found' });
        }
        res.json({ message: 'HR policy deleted successfully' });
    } catch (err) {
        console.error('Error deleting HR policy:', err);
        res.status(500).json({ message: 'Error deleting HR policy', error: err.message });
    }
});

// ✅ Fixed: Proper string interpolation
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
