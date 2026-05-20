const pool = require('../config/database');

exports.getAllEmployees = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [employees] = await pool.query('SELECT * FROM employees ORDER BY employee_id LIMIT ? OFFSET ?', [limit, offset]);
        const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM employees');
        
        res.json({ 
            success: true, 
            employees,
            pagination: {
                page,
                limit,
                total: totalRows[0].count,
                totalPages: Math.ceil(totalRows[0].count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getEmployeeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [employees] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [id]);
        if (employees.length === 0) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.json({ success: true, employee: employees[0] });
    } catch (error) {
        next(error);
    }
};

exports.createEmployee = async (req, res, next) => {
    try {
        const { full_name, email, phone, position, hire_date, salary } = req.body;
        await pool.query(
            'INSERT INTO employees (full_name, email, phone, position, hire_date, salary) VALUES (?, ?, ?, ?, ?, ?)',
            [full_name, email, phone, position, hire_date, salary]
        );
        res.status(201).json({ success: true, message: 'Employee created' });
    } catch (error) {
        next(error);
    }
};

exports.updateEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { full_name, email, phone, position, hire_date, salary, status } = req.body;
        await pool.query(
            'UPDATE employees SET full_name = ?, email = ?, phone = ?, position = ?, hire_date = ?, salary = ?, status = ? WHERE employee_id = ?',
            [full_name, email, phone, position, hire_date, salary, status, id]
        );
        res.json({ success: true, message: 'Employee updated' });
    } catch (error) {
        next(error);
    }
};

exports.deleteEmployee = async (req, res, next) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM employees WHERE employee_id = ?', [id]);
        res.json({ success: true, message: 'Employee deleted' });
    } catch (error) {
        next(error);
    }
};
