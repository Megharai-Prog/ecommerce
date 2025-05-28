const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require("cors");
const { Country, State, City } = require("country-state-city");

// Route handlers
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const contactRoutes = require('./routes/contact');

const app = express();

// ✅ Dynamic port for Glitch
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Also parse JSON bodies
app.use(express.static(path.join(__dirname, 'Public')));

// ✅ Root route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// ✅ Country-State-City API
app.get("/countries", (req, res) => {
  res.json(Country.getAllCountries());
});

app.get("/states/:countryCode", (req, res) => {
  res.json(State.getStatesOfCountry(req.params.countryCode));
});

app.get("/cities/:countryCode/:stateCode", (req, res) => {
  res.json(City.getCitiesOfState(req.params.countryCode, req.params.stateCode));
});

// ✅ Ensure /db directory exists
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// ✅ Connect to SQLite database
const dbPath = path.join(dbDir, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// ✅ Create tables if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      birthday TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      submitted_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// ✅ Attach route handlers
app.use(signupRoutes);
app.use(loginRoutes);
app.use(contactRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
