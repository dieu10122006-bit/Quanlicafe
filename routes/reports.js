const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/revenue', reportController.getRevenue);
router.get('/products', reportController.getProductReport);
router.get('/employees', reportController.getEmployeeReport);
router.get('/daily-revenue', reportController.getDailyRevenue);
router.get('/customers', reportController.getCustomers);

module.exports = router;
