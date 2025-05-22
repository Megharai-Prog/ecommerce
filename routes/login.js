const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(sql, [email, password], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.send(`<script>alert("❌ Server error."); window.history.back();</script>`);
    }

    if (!row) {
      return res.send(`<script>alert("❌ Invalid email or password."); window.history.back();</script>`);
    }

    res.send(`
      <script>
        alert("✅ Login successful! Welcome ${row.username}");
        localStorage.setItem("username", "${row.username}");
        window.location.href = "/index.html";
      </script>
    `);
  });
});

module.exports = router;
