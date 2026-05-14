const pool = require('../config/database');

/**
 * LẤY DANH SÁCH TẤT CẢ DANH MỤC
 * GET /api/categories
 */
exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await pool.query(
            'SELECT category_id, category_name, description, image_url, status FROM categories WHERE status = ? ORDER BY display_order',
            ['active']
        );

        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * LẤY DANH SÁCH TẤT CẢ SẢN PHẨM
 * GET /api/products
 */
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await pool.query(
            `SELECT p.product_id, p.product_name, p.price, p.description, 
                    c.category_id, c.category_name, p.image_url, p.status
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             ORDER BY p.product_id`
        );

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Lỗi lấy danh sách sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * LẤY THÔNG TIN SẢN PHẨM THEO ID
 * GET /api/products/:id
 */
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const [products] = await pool.query(
            `SELECT p.product_id, p.product_name, p.price, p.description, 
                    c.category_id, c.category_name, p.image_url, p.status
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             WHERE p.product_id = ?`,
            [id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.json({
            success: true,
            product: products[0]
        });
    } catch (error) {
        console.error('Lỗi lấy thông tin sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * LẤY SẢN PHẨM THEO DANH MỤC
 * GET /api/products/category/:categoryId
 */
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const [products] = await pool.query(
            `SELECT p.product_id, p.product_name, p.price, p.description, 
                    c.category_id, c.category_name, p.image_url, p.status
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             WHERE p.category_id = ?
             ORDER BY p.product_id`,
            [categoryId]
        );

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Lỗi lấy sản phẩm theo danh mục:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * TẠO SẢN PHẨM MỚI (Admin)
 * POST /api/products
 * Body: { product_name, category_id, price, description }
 */
exports.createProduct = async (req, res) => {
    try {
        const { product_name, category_id, price, description } = req.body;

        // Kiểm tra trường bắt buộc
        if (!product_name || !category_id || !price) {
            return res.status(400).json({
                success: false,
                message: 'Các trường bắt buộc không được để trống'
            });
        }

        await pool.query(
            'INSERT INTO products (product_name, category_id, price, description, status) VALUES (?, ?, ?, ?, ?)',
            [product_name, category_id, price, description, 'active']
        );

        res.status(201).json({
            success: true,
            message: 'Sản phẩm được tạo thành công'
        });
    } catch (error) {
        console.error('Lỗi tạo sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * CẬP NHẬT SẢN PHẨM (Admin)
 * PUT /api/products/:id
 * Body: { product_name, category_id, price, description, status }
 */
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, category_id, price, description, status } = req.body;

        await pool.query(
            'UPDATE products SET product_name = ?, category_id = ?, price = ?, description = ?, status = ? WHERE product_id = ?',
            [product_name, category_id, price, description, status, id]
        );

        res.json({
            success: true,
            message: 'Sản phẩm được cập nhật thành công'
        });
    } catch (error) {
        console.error('Lỗi cập nhật sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};

/**
 * XÓA SẢN PHẨM (Admin)
 * DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM products WHERE product_id = ?', [id]);

        res.json({
            success: true,
            message: 'Sản phẩm được xóa thành công'
        });
    } catch (error) {
        console.error('Lỗi xóa sản phẩm:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ nội bộ'
        });
    }
};
