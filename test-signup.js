const http = require('http');

const data = JSON.stringify({
  username: "testuser2",
  password: "password123",
  email: "test2@email.com",
  fullName: "Test User 2",
  phone: "0123456789"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
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
