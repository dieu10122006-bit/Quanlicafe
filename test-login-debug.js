const pool = require('./config/database');
const bcrypt = require('bcrypt');

async function test() {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', ['admin']);
    console.log(users);
    if (users.length > 0) {
        const user = users[0];
        console.log("Checking password for user:", user);
        console.log("Input:", '123456', "DB hash:", user.password);
        const isMatch = await bcrypt.compare('123456', user.password);
        console.log("isMatch:", isMatch);
    }
}
test().catch(console.error);
