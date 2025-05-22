const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');


router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Simple sanitization
  const safeName = name.trim();
  const safeEmail = email.trim();
  const safeSubject = subject.trim();
  const safeMessage = message.trim();

  db.run(
    `INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)`,
    [safeName, safeEmail, safeSubject, safeMessage],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Something went wrong.");
      }

      // Success response with redirect
      res.send(`
        <script>
          alert("✅ Message sent successfully! We'll get back to you soon.");
          window.location.href = "/index.html";
        </script>
      `);
    }
  );
});


module.exports = router;