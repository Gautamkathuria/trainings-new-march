const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// FIX: Allow requests from any origin in ECS (or specify your ECS frontend URL)
app.use(cors({
  origin: "*", // For production, replace with your specific frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

function getDbConfig() {
  return {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT || 3306 // FIX: Changed from 'port' to 'MYSQL_PORT'
  };
}

let db;

(async () => {
  const cfg = getDbConfig();
  console.log("Connecting to database:", cfg.host);
  
  db = mysql.createConnection(cfg);
  
  db.connect((err) => {
    if (err) {
      console.error("DB connection failed:", err);
      // Log the config (without password) for debugging
      console.error({
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_DB: process.env.MYSQL_DB
      });
    } else {
      console.log("DB connected successfully");
    }
  });
})();

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: "Missing fields" });
  }
  
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ message: "Saved successfully" });
    }
  );
});

app.get("/api/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(4000, () => {
  console.log("Backend running on port 4000");
});
