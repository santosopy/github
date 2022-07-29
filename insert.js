let mysql = require('mysql')
let config = require('./dbconnection.js')
let connection = mysql.createConnection(config)

let rand = Math.floor(Math.random() * 1000000)
let rand2 = Math.floor(Math.random() * 1000000)

let sql = `INSERT INTO table_name(access_token) VALUES ?`
let data = [ [rand], [rand2] ]
connection.query(sql, [data], (err,res,item) => console.log(res))

// let sql = `SELECT * FROM table_name`
// let sql = `SELECT * FROM table_name LIMIT 1`
// let sql = `SELECT * FROM table_name ORDER BY id DESC LIMIT 1`
// connection.query(sql, (err,res,item) => console.log(res))

// let sql = `UPDATE table_name SET access_token = ? WHERE id = ?`
// let data = [ rand, 5 ]
// connection.query(sql, data, (err,res,item) => console.log(res))

// let sql = `DELETE FROM table_name WHERE id = ?`;
// let data = 5
// connection.query(sql, data, (err,res,item) => console.log(res))

connection.end()