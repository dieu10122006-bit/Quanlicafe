const jwt = require('jsonwebtoken');

/**
 * Middleware xác thực người dùng thông qua JWT token
 */
exports.verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Không tìm thấy xác thực token, truy cập bị từ chối'
        });
    }

    try {
        // Xác minh token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'cafe_default_secret_2026'
        );

        // Lưu thông tin người dùng vào request để sử dụng sau này
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

/**
 * Middleware kiểm tra quyền admin
 */
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Truy cập bị từ chối. Yêu cầu quyền quản trị trị viên'
        });
    }
};

/**
 * Middleware kiểm tra quyền staff hoặc admin
 */
exports.isStaffOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Truy cập bị từ chối. Yêu cầu quyền nhân viên'
        });
    }
};
