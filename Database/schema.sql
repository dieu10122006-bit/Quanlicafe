-- ========================================
-- DATABASE SCHEMA: cafe_management_system
-- Optimized for SQLite and Code Compatibility
-- ========================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    status VARCHAR(20) DEFAULT 'active',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active'
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    image_url VARCHAR(255),
    quantity_in_stock INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Tables Table
CREATE TABLE IF NOT EXISTS tables (
    table_id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number INTEGER UNIQUE NOT NULL,
    area VARCHAR(50),
    capacity INTEGER DEFAULT 2,
    status VARCHAR(20) DEFAULT 'available'
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
    employee_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    employee_code VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    position VARCHAR(50),
    hire_date DATE,
    salary DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'working',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    table_id INTEGER,
    customer_name VARCHAR(100),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(12,2) DEFAULT 0,
    final_amount DECIMAL(12,2) DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    payment_method VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (table_id) REFERENCES tables(table_id)
);

-- Order Details Table
CREATE TABLE IF NOT EXISTS order_details (
    order_detail_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(12,2),
    subtotal DECIMAL(12,2),
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    invoice_number VARCHAR(50) UNIQUE,
    invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12,2),
    paid_amount DECIMAL(12,2),
    tax_amount DECIMAL(12,2) DEFAULT 0,
    final_amount DECIMAL(12,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'paid',
    status VARCHAR(20) DEFAULT 'completed',
    notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
