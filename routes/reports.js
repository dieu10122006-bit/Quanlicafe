const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/revenue', verifyToken, isAdmin, reportController.getRevenue);
router.get('/products', verifyToken, isAdmin, reportController.getProductReport);
router.get('/employees', verifyToken, isAdmin, reportController.getEmployeeReport);
router.get('/daily-revenue', verifyToken, isAdmin, reportController.getDailyRevenue);
router.get('/customers', verifyToken, isAdmin, reportController.getCustomers);

module.exports = router;
