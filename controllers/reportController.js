const pool = require('../config/database');

/**
 * LẤY BÁO CÁO DOANH THU
 * GET /api/reports/revenue?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
 */
exports.getRevenue = async (req, res, next) => {
    try {
        const { fromDate, toDate } = req.query;

        let query = 'SELECT SUM(final_amount) as totalRevenue, COUNT(*) as ordersCount, COUNT(DISTINCT customer_name) as customersCount FROM orders WHERE status = "completed"';
        const params = [];

        // Lọc theo khoảng thời gian nếu có
        if (fromDate && toDate) {
            query += ' AND DATE(order_date) BETWEEN ? AND ?';
            params.push(fromDate, toDate);
        }

        const [result] = await pool.query(query, params);

        res.json({
            success: true,
            data: {
                totalRevenue: result[0].totalRevenue || 0,
                ordersCount: result[0].ordersCount || 0,
                customersCount: result[0].customersCount || 0
            }
        });
    } catch (error) {
        console.error('Lỗi lấy báo cáo doanh thu:', error);
        next(error);
    }
};

/**
 * LẤY BÁO CÁO SẢN PHẨM (Top 10 sản phẩm bán chạy)
 * GET /api/reports/products?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
 */
exports.getProductReport = async (req, res, next) => {
    try {
        const { fromDate, toDate } = req.query;

        let query = `
            SELECT p.product_id, p.product_name, c.category_name, 
                   SUM(od.quantity) as sold_count, SUM(od.subtotal) as total_revenue
            FROM order_details od
            LEFT JOIN products p ON od.product_id = p.product_id
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN orders o ON od.order_id = o.order_id
            WHERE 1=1
        `;
        const params = [];

        // Lọc theo khoảng thời gian nếu có
        if (fromDate && toDate) {
            query += ` AND DATE(o.order_date) BETWEEN ? AND ?`;
            params.push(fromDate, toDate);
        }

        query += ` GROUP BY od.product_id ORDER BY sold_count DESC LIMIT 10`;

        const [products] = await pool.query(query, params);

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Lỗi lấy báo cáo sản phẩm:', error);
        next(error);
    }
};

/**
 * LẤY BÁO CÁO NHÂN VIÊN
 * GET /api/reports/employees
 */
exports.getEmployeeReport = async (req, res, next) => {
    try {
        const [employees] = await pool.query(
            'SELECT employee_id, full_name, position, email, phone, hire_date, status FROM employees ORDER BY employee_id'
        );

        res.json({
            success: true,
            employees
        });
    } catch (error) {
        console.error('Lỗi lấy báo cáo nhân viên:', error);
        next(error);
    }
};

/**
 * LẤY BÁO CÁO DOANH THU HÀNG NGÀY
 * GET /api/reports/daily-revenue?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD
 */
exports.getDailyRevenue = async (req, res, next) => {
    try {
        const { fromDate, toDate } = req.query;

        let query = `
            SELECT DATE(order_date) as date, 
                   SUM(final_amount) as revenue, 
                   COUNT(*) as orders,
                   COUNT(DISTINCT customer_name) as customers,
                   AVG(final_amount) as average_order_value
            FROM orders
            WHERE status = "completed"
        `;
        const params = [];

        // Lọc theo khoảng thời gian nếu có
        if (fromDate && toDate) {
            query += ` AND DATE(order_date) BETWEEN ? AND ?`;
            params.push(fromDate, toDate);
        }

        query += ` GROUP BY DATE(order_date) ORDER BY date DESC`;

        const [data] = await pool.query(query, params);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Lỗi lấy báo cáo doanh thu hàng ngày:', error);
        next(error);
    }
};

/**
 * LẤY BÁO CÁO KHÁCH HÀNG
 */
exports.getCustomers = async (req, res, next) => {
    try {
        const [customers] = await pool.query('SELECT user_id, username, full_name, email, phone FROM users WHERE role = "customer"');
        res.json({ success: true, customers });
    } catch (error) {
        next(error);
    }
};
