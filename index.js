require('dotenv').config()
const express = require("express"),
app = express(),
fs = require("fs"),
https = require("https"),

axios = require("axios"),
clientID = process.env.clientID,
clientSecret = process.env.clientSecret,
csrfState = Math.random().toString(36).substring(2)

app.get("/", (req,res)=>{
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
        const accessToken = response.data.data.access_token
        const openId = response.data.data.open_id
        res.redirect(`/home.html?access_token=${accessToken}&open_id=${openId}`)
    })
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