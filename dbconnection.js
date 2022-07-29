// let mysql = require('mysql');
// let connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'your_api',
// });
// connection.connect( err => console.log("Connected to the MySQL server.") );

let config = {
    host    : 'localhost',
    user    : 'root',
    password: 'root',
    database: 'your_api'
  };
  
  module.exports = config;