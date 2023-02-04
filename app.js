require("dotenv").config()
const express = require("express")
const cors = require('cors');
const app = express()

// Setup your Middleware and API Router here
app.use(cors());

app.use('/api',(req, res, next)=>
{
    console.log("stating routers");
    
    //next();

})


module.exports = app;
