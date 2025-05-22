const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');

// Route to handle signup
router.post('/signup', (req, res) => {
  const { email, name, birthday, username, password } = req.body;

  const sql = `INSERT INTO users (email, name, birthday, username, password)
               VALUES (?, ?, ?, ?, ?)`; 

  db.run(sql, [email, name, birthday, username, password], function (err) {
    if (err) {
      console.error(err.message);
      return res.send(`
        <script>
          alert("❌ Signup failed. Username may already exist.");
          window.history.back();
        </script>
      `);
    }

    res.send(`
      <script>
        alert("✅ Signup successful! Welcome, ${username}");
        window.location.href = "/Login.html";
      </script>
    `);
  });
});

module.exports = router;
