const pool = require('../config/database');

exports.getAllEmployees = async (req, res) => {
    try {
        const [employees] = await pool.query('SELECT * FROM employees ORDER BY employee_id');
        res.json({ success: true, employees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const [employees] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [id]);
        if (employees.length === 0) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.json({ success: true, employee: employees[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const { full_name, email, phone, position, hire_date, salary } = req.body;
        await pool.query(
            'INSERT INTO employees (full_name, email, phone, position, hire_date, salary) VALUES (?, ?, ?, ?, ?, ?)',
            [full_name, email, phone, position, hire_date, salary]
        );
        res.status(201).json({ success: true, message: 'Employee created' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, phone, position, hire_date, salary, status } = req.body;
        await pool.query(
            'UPDATE employees SET full_name = ?, email = ?, phone = ?, position = ?, hire_date = ?, salary = ?, status = ? WHERE employee_id = ?',
            [full_name, email, phone, position, hire_date, salary, status, id]
        );
        res.json({ success: true, message: 'Employee updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM employees WHERE employee_id = ?', [id]);
        res.json({ success: true, message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
