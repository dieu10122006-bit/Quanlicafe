const path = require('path');
const fs = require('fs');

let pool;

if (process.env.DB_CONNECTION === 'mysql') {
    const mysql = require('mysql2/promise');
    
    pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'cafe_management',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    
    console.log('✓ MySQL connection pool initialized');
} else {
    // Fallback to SQLite for cloud preview
    const Database = require('better-sqlite3');
    const dbPath = path.join(process.cwd(), 'cafe.db');
    const db = new Database(dbPath);
    
    console.log('✓ SQLite database initialized at', dbPath);
    
    function runSqlFile(filePath) {
        if (!fs.existsSync(filePath)) {
            console.error('❌ SQL file not found:', filePath);
            return;
        }
        let sql = fs.readFileSync(filePath, 'utf8');
        
        sql = sql.replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT');
        sql = sql.replace(/ENUM\([^)]*\)/gi, 'TEXT');
        sql = sql.replace(/DECIMAL\([^)]*\)/gi, 'REAL');
        sql = sql.replace(/DATETIME/gi, 'TEXT');
        sql = sql.replace(/USE [^;]*;/gi, '');
        sql = sql.replace(/CREATE DATABASE [^;]*;/gi, '');
        sql = sql.replace(/ENGINE=[^;]*/gi, '');
        sql = sql.replace(/CHARACTER SET [^;]*/gi, '');
        sql = sql.replace(/collate [^;]*/gi, '');
        sql = sql.replace(/INT PRIMARY KEY AUTOINCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT');
        sql = sql.replace(/VARCHAR\(\d+\)/gi, 'TEXT');
        
        try {
            db.exec(sql);
        } catch (err) {
            const statements = sql.split(/;(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/);
            for (let statement of statements) {
                statement = statement.trim();
                if (statement && !statement.startsWith('--') && !statement.startsWith('/*')) {
                    try { db.prepare(statement).run(); } catch (e) {}
                }
            }
        }
    }

    try {
        const usersTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
        if (!usersTableExists) {
            runSqlFile(path.join(process.cwd(), 'Database', 'schema.sql'));
            runSqlFile(path.join(process.cwd(), 'Database', 'data.sql'));
        }
    } catch (e) {}

    pool = {
        query: async (sql, params = []) => {
            try {
                let processedSql = sql.replace(/NOW\(\)/gi, "CURRENT_TIMESTAMP");
                const isSelect = processedSql.trim().toLowerCase().startsWith('select');
                if (isSelect) {
                    const rows = db.prepare(processedSql).all(params);
                    return [rows, []];
                } else {
                    const result = db.prepare(processedSql).run(params);
                    return [{
                        insertId: result.lastInsertRowid,
                        affectedRows: result.changes
                    }, []];
                }
            } catch (error) {
                throw error;
            }
        },
        getConnection: async () => ({
            query: pool.query,
            beginTransaction: async () => db.prepare('BEGIN TRANSACTION').run(),
            commit: async () => db.prepare('COMMIT').run(),
            rollback: async () => db.prepare('ROLLBACK').run(),
            release: () => {}
        })
    };
}

module.exports = pool;
