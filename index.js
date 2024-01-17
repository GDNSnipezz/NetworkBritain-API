// Packages
const express = require("express");
const app = express();
const slash = require("express-slash");
const axios = require("axios").default;
const path = import("path");
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bodyParserErrorHandler = require('express-body-parser-error-handler')

// Variables
const token = process.env['trellotoken'];
const key = process.env['trellokey'];

const events_URL = "https://api.trello.com/1/lists/651818356ae6e5eef0e69d4e/cards";
const pla_URL = "https://api.trello.com/1/lists/651818356ae6e5eef0e69d4f/cards";
const top_URL = "https://api.trello.com/1/lists/651818356ae6e5eef0e69d50/cards";
const ongoing_URL = "https://api.trello.com/1/lists/651818356ae6e5eef0e69d51/cards";

const end_of_URL = `?key=${key}&token=${token}`;

let events = [];
let pla = [];
let top = [];
let ongoing = [];

let doShutdown = false;

// App settings
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParserErrorHandler());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let updateAll = () => {
  axios.get(events_URL + end_of_URL)
    .then(function (response) {
      events = response.data
  })
  .catch(function (error) {
    console.log(error);
  })
  
  axios.get(top_URL + end_of_URL)
    .then(function (response) {
      top = response.data
  })
  .catch(function (error) {
    console.log(error);
  })
  
  axios.get(ongoing_URL + end_of_URL)
    .then(function (response) {
      ongoing = response.data
  })
  .catch(function (error) {
    console.log(error);
  })
  
  axios.get(pla_URL + end_of_URL)
    .then(function (response) {
      pla = response.data
  })
  .catch(function (error) {
    console.log(error);
  })
}

// Routes
app.get("/", (req, res) => {
  return res.json({
    status: 'error',
    error: 'What are you doing here? This is private!'
  });
});

app.post("/updateShutdown", (req, res) => {
  doShutdown = req.body.doShutdown

  return res.json({
    status: 'ok',
    data: {
      doShutdown: doShutdown
    }
  });
});

app.get("/checkShutdown", (req, res) => {
  return res.json({
    status: 'ok',
    data: {
      doShutdown: doShutdown
    }
  });
});

app.get("/admin", (req, res) => {
  return res.json(ongoing);
});

app.get("/top", (req, res) => {
  return res.json(top);
});

app.get("/pla", (req, res) => {
  return res.json(pla);
});

app.get("/events", (req, res) => {
  return res.json(events);
});

updateAll();

setInterval(updateAll, 10000); // every 30s

// Port
app.listen(process.env.PORT);