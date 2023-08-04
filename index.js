
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const { getAllUsers, getSingleUser, createUser, updateUser } = require('./controllers/users.controller');

app.use(express.json());

app.get("/users", getAllUsers);
app.get("/users/:userId", getSingleUser);
app.post("/users", createUser);
app.patch("/users/:userId", updateUser);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
