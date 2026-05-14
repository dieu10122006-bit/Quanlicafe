const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Lấy danh sách sản phẩm
router.get('/', productController.getAllProducts);

// Lấy thông tin sản phẩm theo ID
router.get('/:id', productController.getProductById);

// Lấy sản phẩm theo danh mục
router.get('/category/:categoryId', productController.getProductsByCategory);

// Tạo sản phẩm mới (Admin)
router.post('/', productController.createProduct);

// Cập nhật sản phẩm (Admin)
router.put('/:id', productController.updateProduct);

// Xóa sản phẩm (Admin)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
