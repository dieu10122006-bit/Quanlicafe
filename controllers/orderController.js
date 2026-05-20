const pool = require('../config/database');

exports.getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [orders] = await pool.query('SELECT * FROM orders ORDER BY order_date DESC LIMIT ? OFFSET ?', [limit, offset]);
        const [totalRows] = await pool.query('SELECT COUNT(*) as count FROM orders');
        
        res.json({ 
            success: true, 
            orders, 
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

exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [orders] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [id]);
        if (orders.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
        
        const [details] = await pool.query('SELECT * FROM order_details WHERE order_id = ?', [id]);
        res.json({ success: true, order: { ...orders[0], details } });
    } catch (error) {
        next(error);
    }
};

exports.createOrder = async (req, res, next) => {
    let connection;
    try {
        const { user_id, table_id, customer_name, items, total_amount, discount_percent, final_amount } = req.body;
        
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO orders (user_id, table_id, customer_name, total_amount, discount_percent, final_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, table_id, customer_name, total_amount, discount_percent, final_amount, 'pending']
        );
        
        const orderId = result.insertId;
        
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_details (order_id, product_id, quantity, unit_price, total_price, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price, item.quantity * item.price, item.quantity * item.price]
            );
        }
        
        await connection.commit();
        const io = req.app.get('io');
        if (io) {
            io.emit('new_order', { orderId, table_id, status: 'pending' });
        }
        res.status(201).json({ success: true, orderId });
    } catch (error) {
        if (connection) await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

exports.updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, total_amount, final_amount } = req.body;
        await pool.query('UPDATE orders SET status = ?, total_amount = ?, final_amount = ? WHERE order_id = ?', [status, total_amount, final_amount, id]);
        const io = req.app.get('io');
        if (io) {
            io.emit('order_updated', { orderId: id, status });
        }
        res.json({ success: true, message: 'Order updated' });
    } catch (error) {
        next(error);
    }
};

exports.deleteOrder = async (req, res, next) => {
    let connection;
    try {
        const { id } = req.params;
        connection = await pool.getConnection();
        await connection.beginTransaction();

        await connection.query('DELETE FROM order_details WHERE order_id = ?', [id]);
        await connection.query('DELETE FROM orders WHERE order_id = ?', [id]);
        
        await connection.commit();
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        if (connection) await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

exports.getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const [invoices] = await pool.query('SELECT * FROM invoices WHERE order_id = ?', [id]);
        res.json({ success: true, invoice: invoices[0] || null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
