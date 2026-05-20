const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const validateReq = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// Đăng nhập
router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
], validateReq, authController.login);

// Đăng ký (Tạo placeholder nếu thiếu controller)
router.post('/signup', [
    body('username').isLength({ min: 3 }).withMessage('Tên đăng nhập phải có ít nhất 3 ký tự'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('fullName').notEmpty().withMessage('Tên đầy đủ là bắt buộc'),
], validateReq, authController.signup || (async (req, res) => {
    res.status(501).json({ success: false, message: 'Tính năng đăng ký đang được bảo trì' });
}));

// Alias for register
router.post('/register', [
    body('username').isLength({ min: 3 }).withMessage('Tên đăng nhập phải có ít nhất 3 ký tự'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('fullName').notEmpty().withMessage('Tên đầy đủ là bắt buộc'),
], validateReq, authController.signup || (async (req, res) => {
    res.status(501).json({ success: false, message: 'Tính năng đăng ký đang được bảo trì' });
}));

// Kiểm tra username/email
router.get('/check-username', authController.checkUsername || ((req, res) => res.json({ success: true, available: true })));
router.get('/check-email', authController.checkEmail || ((req, res) => res.json({ success: true, available: true })));

// Lấy thông tin người dùng hiện tại
router.get('/me', verifyToken, authController.getCurrentUser);

// Đăng xuất
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Đã đăng xuất thành công' });
});

module.exports = router;
