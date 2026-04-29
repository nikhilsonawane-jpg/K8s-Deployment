const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: "mysql",   // will change in Docker/K8s
  user: "root",
  password: "root",
  database: "testdb"
});

db.connect(err => {
  if (err) {
    console.log("DB connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
  )
`);

// Routes
app.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    res.render("index", { users: results });
  });
});

app.post("/add", (req, res) => {
  const name = req.body.name;
  db.query("INSERT INTO users (name) VALUES (?)", [name], () => {
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
