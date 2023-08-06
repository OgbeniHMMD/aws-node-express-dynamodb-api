
const express = require("express");
const serverless = require("serverless-http");

const indexRouter = require('./routers/indexRouter');
const usersRouter = require('./routers/usersRouter');

require('dotenv').config()
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

if (process.env.ENVIRONMENT == 'production') {
  exports.handler = serverless(app);
} else {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
}

