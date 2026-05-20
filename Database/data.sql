-- ========================================
-- DỮ LIỆU MẶC ĐỊNH
-- cafe_management_system
-- ========================================

-- USE cafe_management_system; -- SQLite doesn't use USE

-- ========================================
-- 1. THÊM NGƯỜI DÙNG
-- ========================================

INSERT INTO users (username, email, password, full_name, phone, role, status) VALUES
('admin', 'admin@cafe.local', '$2b$10$K7xVrVKit4djrOpouzjG4O.oat/yVgjdsLZH6Gfgp7GtCfUh024UC', 'Admin Cafe', '0123456789', 'admin', 'active'),
('staff_001', 'staff1@cafe.local', '$2b$10$K7xVrVKit4djrOpouzjG4O.oat/yVgjdsLZH6Gfgp7GtCfUh024UC', 'Nhân viên 1', '0123456790', 'staff', 'active'),
('staff_002', 'staff2@cafe.local', '$2b$10$K7xVrVKit4djrOpouzjG4O.oat/yVgjdsLZH6Gfgp7GtCfUh024UC', 'Nhân viên 2', '0123456791', 'staff', 'active'),
('staff_003', 'staff3@cafe.local', '$2b$10$K7xVrVKit4djrOpouzjG4O.oat/yVgjdsLZH6Gfgp7GtCfUh024UC', 'Nhân viên 3', '0123456792', 'staff', 'active');

-- Password mặc định: '123456' (đã hash)

-- ========================================
-- 2. THÊM DANH MỤC SẢN PHẨM
-- ========================================

INSERT INTO categories (category_name, description, image_url, display_order, status) VALUES
('Cà Phê', 'Các loại cà phê đỏa, pha phin, cappuccino', '/images/coffee.jpg', 1, 'active'),
('Trà', 'Trà đen, trà xanh, trà sữa', '/images/tea.jpg', 2, 'active'),
('Nước Ép', 'Nước ép cam, dưa hấu, cà chua', '/images/juice.jpg', 3, 'active'),
('Đồ Ăn Nhẹ', 'Bánh mì, bánh quy, khoai tây chiên', '/images/snacks.jpg', 4, 'active'),
('Tráng Miệng', 'Kem, pudding, bánh kem', '/images/dessert.jpg', 5, 'active'),
('Nước Uống Khác', 'Soda, nước lạnh, nước khoáng', '/images/beverages.jpg', 6, 'active');

-- ========================================
-- 3. THÊM SẢN PHẨM
-- ========================================

-- Danh mục: Cà Phê
INSERT INTO products (category_id, product_name, description, price, cost, image_url, quantity_in_stock, status) VALUES
(1, 'Cà Phê Đen', 'Cà phê đen nóng pha phin truyền thống', 20000, 8000, '/images/coffee_black.jpg', 100, 'active'),
(1, 'Cà Phê Sữa', 'Cà phê sữa nóng pha phin', 25000, 10000, '/images/coffee_milk.jpg', 100, 'active'),
(1, 'Cà Phê Đen Đá', 'Cà phê đen lạnh pha phin', 22000, 10000, '/images/coffee_black_ice.jpg', 100, 'active'),
(1, 'Cà Phê Sữa Đá', 'Cà phê sữa lạnh pha phin', 27000, 12000, '/images/coffee_milk_ice.jpg', 100, 'active'),
(1, 'Cappuccino', 'Cappuccino nóng với bột cacao', 35000, 15000, '/images/cappuccino.jpg', 80, 'active'),
(1, 'Espresso', 'Espresso tinh khiết', 30000, 12000, '/images/espresso.jpg', 80, 'active');

-- Danh mục: Trà
INSERT INTO products (category_id, product_name, description, price, cost, image_url, quantity_in_stock, status) VALUES
(2, 'Trà Đen', 'Trà đen nóng', 15000, 5000, '/images/black_tea.jpg', 100, 'active'),
(2, 'Trà Xanh', 'Trà xanh nóng', 15000, 5000, '/images/green_tea.jpg', 100, 'active'),
(2, 'Trà Sữa', 'Trà xanh sữa tươi', 30000, 12000, '/images/milk_tea.jpg', 100, 'active'),
(2, 'Trà Sữa Đá', 'Trà xanh sữa tươi lạnh', 32000, 13000, '/images/milk_tea_ice.jpg', 100, 'active');

-- Danh mục: Nước Ép
INSERT INTO products (category_id, product_name, description, price, cost, image_url, quantity_in_stock, status) VALUES
(3, 'Nước Cam Ép', 'Nước cam tươi ép', 30000, 10000, '/images/orange_juice.jpg', 80, 'active'),
(3, 'Nước Dưa Hấu', 'Nước dưa hấu lạnh', 28000, 9000, '/images/watermelon.jpg', 80, 'active'),
(3, 'Nước Cà Chua', 'Nước cà chua tươi', 25000, 8000, '/images/tomato_juice.jpg', 80, 'active');

-- Danh mục: Đồ Ăn Nhẹ
INSERT INTO products (category_id, product_name, description, price, cost, image_url, quantity_in_stock, status) VALUES
(4, 'Bánh Mì Thịt', 'Bánh mì cuộn thịt, rau sống', 35000, 15000, '/images/meat_sandwich.jpg', 50, 'active'),
(4, 'Bánh Mì Pâté', 'Bánh mì sốp pâté', 30000, 12000, '/images/pate_sandwich.jpg', 50, 'active'),
(4, 'Khoai Tây Chiên', 'Khoai tây chiên giòn', 20000, 8000, '/images/fries.jpg', 100, 'active'),
(4, 'Bánh Quy', 'Bánh quy bơ béo', 18000, 7000, '/images/cookies.jpg', 150, 'active');

-- Danh mục: Tráng Miệng
INSERT INTO products (category_id, product_name, description, price, cost, image_url, quantity_in_stock, status) VALUES
(5, 'Kem Vani', 'Kem vani lạnh mát', 25000, 10000, '/images/vanilla_ice_cream.jpg', 80, 'active'),
(5, 'Kem Socola', 'Kem socola đậm đà', 25000, 10000, '/images/chocolate_ice_cream.jpg', 80, 'active'),
(5, 'Pudding', 'Pudding caramel', 20000, 8000, '/images/pudding.jpg', 100, 'active');

-- Danh mục: Nước Uống Khác
INSERT INTO products (category_id, product_name, description, price, cost, image_url, quantity_in_stock, status) VALUES
(6, 'Coca Cola', 'Coca Cola lạnh', 15000, 6000, '/images/coke.jpg', 200, 'active'),
(6, 'Sprite', 'Sprite lạnh', 15000, 6000, '/images/sprite.jpg', 200, 'active'),
(6, 'Nước Khoáng', 'Nước khoáng lạnh', 10000, 3000, '/images/mineral_water.jpg', 300, 'active');

-- ========================================
-- 4. THÊM BÀN PHỤC VỤ
-- ========================================

INSERT INTO tables (table_number, area, capacity, status) VALUES
(1, 'Hall', 2, 'available'),
(2, 'Hall', 2, 'available'),
(3, 'Hall', 4, 'available'),
(4, 'Hall', 4, 'available'),
(5, 'Hall', 6, 'available'),
(6, 'VIP', 2, 'available'),
(7, 'VIP', 4, 'available'),
(8, 'Private Room', 8, 'available');

-- ========================================
-- 5. THÊM NHÂN VIÊN
-- ========================================

INSERT INTO employees (user_id, employee_code, full_name, email, phone, position, hire_date, salary, status) VALUES
(2, 'NV001', 'Nhân viên 1', 'staff1@cafe.local', '0123456790', 'Phục vụ', '2025-01-01', 5000000, 'working'),
(3, 'NV002', 'Nhân viên 2', 'staff2@cafe.local', '0123456791', 'Pha chế', '2025-01-15', 6000000, 'working'),
(4, 'NV003', 'Nhân viên 3', 'staff3@cafe.local', '0123456792', 'Thu ngân', '2025-02-01', 5500000, 'working');

-- ========================================
-- 6. THÊM CÁC ĐƠN HÀNG MẪU
-- ========================================

-- Đơn hàng 1
INSERT INTO orders (user_id, table_id, customer_name, order_date, status, total_amount, discount_percent, payment_method) VALUES
(2, 1, 'Anh Hùng', '2026-04-15 10:30:00', 'paid', 0, 0, 'cash');

INSERT INTO order_details (order_id, product_id, quantity, unit_price, total_price, notes) VALUES
(1, 1, 2, 20000, 40000, 'Không đường'),
(1, 4, 1, 27000, 27000, ''),
(1, 15, 1, 25000, 25000, 'Kem vani');

-- Đơn hàng 2  
INSERT INTO orders (user_id, table_id, customer_name, order_date, status, total_amount, discount_percent, payment_method) VALUES
(3, 3, 'Chị Lan', '2026-04-15 12:00:00', 'paid', 0, 5, 'card');

INSERT INTO order_details (order_id, product_id, quantity, unit_price, total_price, notes) VALUES
(2, 5, 2, 35000, 70000, ''),
(2, 14, 2, 20000, 40000, ''),
(2, 11, 3, 30000, 90000, '');

-- ========================================
-- 7. THÊM HÓA ĐƠN
-- ========================================

INSERT INTO invoices (order_id, invoice_number, invoice_date, total_amount, tax_amount, final_amount, payment_status, notes) VALUES
(1, 'INV-001', '2026-04-15 11:00:00', 92000, 0, 92000, 'paid', 'Thanh toán tiền mặt'),
(2, 'INV-002', '2026-04-15 12:30:00', 195000, 0, 185250, 'paid', 'Giảm giá 5%');

-- ========================================
-- HOÀN TẤT
-- ========================================

-- SELECT 'Dữ liệu mặc định đã được thêm thành công!' AS Message;
