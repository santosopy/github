require('dotenv').config()

let mysql = require('mysql'),
config = require('./dbconnection.js'),
connection = mysql.createConnection(config)

const express = require("express"),
app = express(),
fs = require("fs"),
https = require("https"),

axios = require("axios"),
clientID = process.env.clientID,
clientSecret = process.env.clientSecret,
csrfState = Math.random().toString(36).substring(2)

// oauth2 start
app.get("/tiktok", (req,res)=>{
    res.send("<a href='/oauth'>go to auth</a>")
})

app.get("/oauth", (req,res)=>{
    let url = 'https://www.tiktok.com/auth/authorize/';

    url += `?client_key=${clientID}`;
    url += '&scope=user.info.basic,video.list';
    url += '&response_type=code';
    url += '&redirect_uri=https://127.0.0.1/home';
    url += '&state=' + csrfState;

    res.redirect(url);
})

app.get("/home", (req,res)=>{
    const requestToken = req.query.code
    
    let url_access_token = 'https://open-api.tiktok.com/oauth/access_token/'
    url_access_token += '?client_key=' + clientID
    url_access_token += '&client_secret=' + clientSecret
    url_access_token += '&code=' + requestToken
    url_access_token += '&grant_type=authorization_code'

    axios({
        method: 'post',
        url: url_access_token,
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        const accessToken = response.data.data.access_token,
            refreshToken = response.data.data.refresh_token,
            openId = response.data.data.open_id
        // res.redirect(`/home.html?access_token=${accessToken}&open_id=${openId}`)

        let sql = `TRUNCATE table table_name`;
        connection.query(sql, (err,res,item) => console.log(res))

        sql = `INSERT INTO table_name(access_token, refresh_token, open_id) VALUES ?`
        let data = [ [accessToken, refreshToken, openId] ]
        connection.query(sql, [data], (err,res,item) => console.log(res))
        connection.end()
        res.redirect(`/home.html`)
    })
})
// oauth2 end

app.get("/", (req,res)=>{
    let sql = `SELECT * FROM table_name`,
    accessToken = "",
    refreshToken = "",
    openId = ""
    connection.query(sql, (err,res,item) =>{
        res.forEach(element => {
            accessToken = element.access_token
            refreshToken = element.refresh_token
            openId = element.open_id
            console.log(accessToken)
        })
    })
    connection.end()
})

app.use(express.static(__dirname + "/public"))

https
.createServer({
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
}, app)
.listen(443, function () {
    console.log("server port 443")
})