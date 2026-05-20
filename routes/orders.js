const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isStaffOrAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, orderController.getAllOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.post('/', verifyToken, isStaffOrAdmin, orderController.createOrder);
router.put('/:id', verifyToken, isStaffOrAdmin, orderController.updateOrder);
router.delete('/:id', verifyToken, isStaffOrAdmin, orderController.deleteOrder);
router.get('/:id/invoice', verifyToken, orderController.getInvoice);

module.exports = router;
