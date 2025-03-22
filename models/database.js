var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost", // your host name
  user: "root",
  // database username
  password: "",
  // database password
  database: "web503_nodejs", //database Name
  insecureAuth: true,
});
db.connect(function (err) {
  if (err) throw err;
  console.log("Database is connected successfully !");
});

module.exports = db;
