require("dotenv").config()
const express = require("express")
const cors = require('cors');
const morgan = require('morgan');
const app = express()

// Setup your Middleware and API Router here
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const apiRouter = require('./api');
app.use('/api', apiRouter)


module.exports = app;
