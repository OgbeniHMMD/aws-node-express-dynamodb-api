
require('dotenv').config()
const express = require("express");
const serverless = require("serverless-http");

const indexRouter = require('./routers/indexRouter');
const usersRouter = require('./routers/usersRouter');

const app = express();
app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

exports.handler = serverless(app);

