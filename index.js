require('dotenv').config()
const express = require("express"),
app = express(),

axios = require("axios"),
clientID = process.env.clientID,
clientSecret = process.env.clientSecret

app.get("/", (req,res)=>{
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientID}`)
})

app.get("/home", (req,res)=>{
    const requestToken = req.query.code
    
    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        const accessToken = response.data.access_token
        res.redirect(`/home.html?access_token=${accessToken}`)
    })
})

app.use(express.static(__dirname + "/public"))

app.listen(4000, ()=>{
    console.log("server port 4000")
})