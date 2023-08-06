
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

let dynamoDBClientQuery = {}
if (process.env.ENVIRONMENT == 'production') {
    dynamoDBClientQuery = {
        region: process.env.AWS_REGION,
        endpoint: process.env.AWS_DDB_ENDPOINT,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    }
}

const client = new DynamoDBClient(dynamoDBClientQuery);

module.exports = {
    dynamoDB: DynamoDBDocument.from(client),
    USERS_TABLE: process.env.USERS_TABLE
}
