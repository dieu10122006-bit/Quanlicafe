const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/process/:orderId', paymentController.processPayment);
router.get('/:id', paymentController.getPaymentById);
router.post('/:id/refund', paymentController.refundPayment);

module.exports = router;
