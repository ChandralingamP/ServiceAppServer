const mysql = require("mysql2");
const con = mysql.createConnection({
  host: "localhost",
  user: "appapk",
  password: "appapk",
  database: "appapk",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;