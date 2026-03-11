const express = require('express');
const app = express();
app.get('/hello',(req, res) => {
    res.json({ message: "Hello from Node.js backend!" });
});
app.listen(4000,'0.0.0.0', () => console.log("Node.js API running on port 4000"));

