const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

/**
 * ĐĂNG NHẬP - Xác thực người dùng và tạo JWT token
 * POST /api/auth/login
 * Body: { username, password }
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra dữ liệu bắt buộc
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Tên đăng nhập và mật khẩu là bắt buộc'
            });
        }

        // Tìm người dùng trong cơ sở dữ liệu
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        const user = users[0];

        // Kiểm tra mật khẩu (sử dụng bcrypt)
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            // Kiểm tra fallback plain text nếu bcrypt thất bại (để hỗ trợ dev/demo)
            if (user.password !== password) {
                return res.status(401).json({
                    success: false,
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                });
            }
        }

        // Tạo JWT token
        const token = jwt.sign(
            {
                id: user.user_id,
                username: user.username,
                role: user.role,
                name: user.full_name
            },
            process.env.JWT_SECRET || 'cafe_default_secret_2026',
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.user_id,
                username: user.username,
                name: user.full_name,
                role: user.role,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * LẤY THÔNG TIN NGƯỜI DÙNG HIỆN TẠI
 * GET /api/auth/current-user
 * Header: Authorization: Bearer token
 */
exports.getCurrentUser = async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT user_id, username, full_name, role, email FROM users WHERE user_id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error('Lỗi lấy thông tin người dùng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * ĐĂNG KÝ - Tạo tài khoản người dùng mới
 * POST /api/auth/signup
 */
exports.signup = async (req, res) => {
    try {
        const { username, password, email, fullName, phone, role } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
        }

        // Kiểm tra trùng lặp
        const [existing] = await pool.query('SELECT user_id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Tên đăng nhập hoặc email đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu người dùng
        const userRole = role || 'customer';
        const [result] = await pool.query(
            'INSERT INTO users (username, password, email, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, email, fullName, phone, userRole]
        );

        const userId = result.insertId;

        // Tạo JWT token (để người dùng có thể đăng nhập ngay sau khi đăng ký)
        const token = jwt.sign(
            {
                id: userId,
                username,
                role: userRole,
                name: fullName
            },
            process.env.JWT_SECRET || 'cafe_default_secret_2026',
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công',
            token,
            user: {
                id: userId,
                username,
                name: fullName,
                role: userRole,
                email
            }
        });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
};

/**
 * Kiểm tra tên đăng nhập đã tồn tại chưa
 */
exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.query;
        const [users] = await pool.query('SELECT user_id FROM users WHERE username = ?', [username]);
        res.json({ success: true, available: users.length === 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Kiểm tra email đã tồn tại chưa
 */
exports.checkEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const [users] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
        res.json({ success: true, available: users.length === 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
