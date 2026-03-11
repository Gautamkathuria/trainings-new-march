const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 1. HEALTH CHECK (Critical for AWS)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 2. MAIN BACKEND ROUTE
app.get('/', (req, res) => {
  res.json({
    message: "Node.js Backend is Live!",
    timestamp: new Date().toISOString(),
    platform: "ECS Fargate"
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
