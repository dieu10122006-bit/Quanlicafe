const http = require('http');

const data = JSON.stringify({
  username: "testuser3",
  password: "password123",
  email: "test3@email.com",
  fullName: "Test User 3",
  phone: "0123456789"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Signup:', body));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
