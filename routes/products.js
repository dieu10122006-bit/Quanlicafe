const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Lấy danh sách sản phẩm
router.get('/', cacheMiddleware(300), productController.getAllProducts);

// Lấy thông tin sản phẩm theo ID
router.get('/:id', cacheMiddleware(300), productController.getProductById);

// Lấy sản phẩm theo danh mục
router.get('/category/:categoryId', cacheMiddleware(300), productController.getProductsByCategory);

// Tạo sản phẩm mới (Admin)
router.post('/', verifyToken, isAdmin, productController.createProduct);

// Cập nhật sản phẩm (Admin)
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);

// Xóa sản phẩm (Admin)
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
