const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const signupRoutes = require('./routes/signup');
const loginRoutes = require('./routes/login');
const contactroute = require('./routes/contact');
const { Country, State, City } = require("country-state-city");
const cors = require("cors");



const app = express();
const PORT = 3000;
app.use(cors());

app.get("/countries", (req, res) => {
  const countries = Country.getAllCountries();
  res.json(countries);
});

app.get("/states/:countryCode", (req, res) => {
  const states = State.getStatesOfCountry(req.params.countryCode);
  res.json(states);
});

app.get("/cities/:countryCode/:stateCode", (req, res) => {
  const cities = City.getCitiesOfState(req.params.countryCode, req.params.stateCode);
  res.json(cities);
});


// Create db directory if not exists
if (!fs.existsSync('./db')) fs.mkdirSync('./db');

const db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) return console.error(err.message);
  console.log('✅ Connected to SQLite database');
});

// Create users table
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(signupRoutes);
app.use(loginRoutes);
app.use(contactroute);



// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
