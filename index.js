
require('dotenv').config()
const path = require('path')

const express = require("express");
const serverless = require("serverless-http");

const indexRouter = require('./routers/indexRouter');
const usersRouter = require('./routers/usersRouter');

const app = express();
app.use(express.json());

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/docs', express.static(path.join(__dirname, '/docs')))

app.use((req, res, next) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

exports.handler = serverless(app);

