const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, isStaffOrAdmin, isAdmin } = require('../middleware/authMiddleware');

router.post('/process/:orderId', verifyToken, isStaffOrAdmin, paymentController.processPayment);
router.get('/:id', verifyToken, paymentController.getPaymentById);
router.post('/:id/refund', verifyToken, isAdmin, paymentController.refundPayment);

module.exports = router;
