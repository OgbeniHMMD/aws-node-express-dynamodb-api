const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const crypto = require('crypto');
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;

let dynamoDBClientQuery = {}
if (process.env.IS_OFFLINE) {
  dynamoDBClientQuery = {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_DDB_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  }
}

const dynamoDBClient = new DynamoDBClient(dynamoDBClientQuery);
const dynamoDBDocument = DynamoDBDocument.from(dynamoDBClient);

app.use(express.json());

app.get("/users", async function (req, res) {
  var params = {
    TableName: USERS_TABLE,
  };

  try {
    const { Item } = await dynamoDBDocument.scan(params);

    if (Item) {
      res.json({ message: DONE });
    } else {
      res.json({ message: 'Users not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

  try {
    const { Item } = await dynamoDBDocument.get(params);

    if (Item) {
      const { userId, firstName, lastName } = Item;
      res.json({ userId, firstName, lastName });
    } else {
      res.json({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/users", async function (req, res) {
  const { firstName, lastName } = req.body;
  if (typeof firstName !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  } else if (typeof lastName !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const userId = crypto.randomUUID()
  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId, firstName, lastName
    },
  };

  try {
    await dynamoDBDocument.put(params);
    res.json({
      message: "User created successfully",
      data: params.Item
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.patch("/users/:userId", async function (req, res) {
  const { firstName, lastName } = req.body;
  if (typeof firstName !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  } else if (typeof lastName !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: req.params.userId,
      firstName,
      lastName
    },
  };

  try {
    await dynamoDBDocument.put(params);
    res.json({
      message: "User updated successfully",
      data: params.Item
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
