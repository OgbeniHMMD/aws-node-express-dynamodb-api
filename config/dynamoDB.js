const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

let dynamoDBClientQuery = {}
let USERS_TABLE = "users-table-dev"

if (process.env.ENVIRONMENT == 'development') {
    USERS_TABLE = process.env.USERS_TABLE
    dynamoDBClientQuery = {
        region: process.env.AWS_REGION,
        endpoint: process.env.AWS_DDB_ENDPOINT,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    }
}

const client = new DynamoDBClient();
const dynamoDBDocument = DynamoDBDocument.from(client);

module.exports = {
    dynamoDBDocument,
    USERS_TABLE
}
