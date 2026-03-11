// app.js
const http = require('http');

// Read environment variables (optional)
const PORT = process.env.PORT || 3000;
const ENV = process.env.ENV || 'development';

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`Hello World!\nEnvironment: ${ENV}\n`);
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${ENV} mode`);
});

