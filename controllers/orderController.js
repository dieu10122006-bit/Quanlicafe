const pool = require('../config/database');

exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders ORDER BY order_date DESC');
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const [orders] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [id]);
        if (orders.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
        
        const [details] = await pool.query('SELECT * FROM order_details WHERE order_id = ?', [id]);
        res.json({ success: true, order: { ...orders[0], details } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { user_id, table_id, customer_name, items, total_amount, discount_percent, final_amount } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO orders (user_id, table_id, customer_name, total_amount, discount_percent, final_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, table_id, customer_name, total_amount, discount_percent, final_amount, 'pending']
        );
        
        const orderId = result.insertId;
        
        for (const item of items) {
            await pool.query(
                'INSERT INTO order_details (order_id, product_id, quantity, unit_price, total_price, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price, item.quantity * item.price, item.quantity * item.price]
            );
        }
        
        res.status(201).json({ success: true, orderId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, total_amount, final_amount } = req.body;
        await pool.query('UPDATE orders SET status = ?, total_amount = ?, final_amount = ? WHERE order_id = ?', [status, total_amount, final_amount, id]);
        res.json({ success: true, message: 'Order updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM order_details WHERE order_id = ?', [id]);
        await pool.query('DELETE FROM orders WHERE order_id = ?', [id]);
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
