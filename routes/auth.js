const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Đăng nhập
router.post('/login', authController.login);

// Đăng ký (Tạo placeholder nếu thiếu controller)
router.post('/signup', authController.signup || (async (req, res) => {
    res.status(501).json({ success: false, message: 'Tính năng đăng ký đang được bảo trì' });
}));

// Kiểm tra username/email
router.get('/check-username', authController.checkUsername || ((req, res) => res.json({ success: true, available: true })));
router.get('/check-email', authController.checkEmail || ((req, res) => res.json({ success: true, available: true })));

// Lấy thông tin người dùng hiện tại
router.get('/me', authController.getCurrentUser);

// Đăng xuất
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Đã đăng xuất thành công' });
});

module.exports = router;
