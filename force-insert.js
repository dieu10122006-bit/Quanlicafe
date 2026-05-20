const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const dbPath = path.join(process.cwd(), 'cafe.db');
const db = new Database(dbPath);

let sql = fs.readFileSync(path.join(process.cwd(), 'Database', 'data.sql'), 'utf8');

try {
    db.exec(sql);
    console.log("Success");
} catch (e) {
    console.error("Error", e);
}
