const pool = require('../config/database');

exports.processPayment = async (req, res, next) => {
    let connection;
    try {
        const { orderId } = req.params;
        const { amount, method, notes } = req.body;
        
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Cập nhật trạng thái đơn hàng
        await connection.query('UPDATE orders SET status = ?, payment_method = ? WHERE order_id = ?', ['completed', method, orderId]);
        
        // Tạo hóa đơn
        const invoiceNumber = 'INV' + Date.now();
        await connection.query(
            'INSERT INTO invoices (order_id, invoice_number, total_amount, paid_amount, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [orderId, invoiceNumber, amount, amount, method, notes]
        );
        
        await connection.commit();
        res.json({ success: true, message: 'Payment processed' });
    } catch (error) {
        if (connection) await connection.rollback();
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const [payments] = await pool.query('SELECT * FROM invoices WHERE invoice_id = ?', [id]);
        res.json({ success: true, payment: payments[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.refundPayment = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('UPDATE invoices SET status = ? WHERE invoice_id = ?', ['refunded', id]);
        res.json({ success: true, message: 'Payment refunded' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
