const { randomUUID } = require('crypto');
const { dynamoDB, USERS_TABLE } = require("../config/dynamoDB");
const { throwError500 } = require('../lib/errorHandlers');

exports.getAllUsers = async function (req, res) {
    const params = {
        TableName: USERS_TABLE,
        Limit: 10,
        LastEvaluatedKey: ''
    };

    try {
        const { Items: data, Count, LastEvaluatedKey } = await dynamoDB.scan(params);
        if (Count) {
            res.json({ data, Count, LastEvaluatedKey });
        } else {
            res.json({ message: 'Users not found' });
        }
    } catch (error) {
        throwError500(res, error);
    }
}

exports.getSingleUser = async function (req, res) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            userId: req.params.userId,
        },
    };

    try {
        const { Item } = await dynamoDB.get(params);

        if (Item) {
            res.json({
                data: Item,
                message: "User found",
            });
        } else {
            res.json({ message: 'User not found' });
        }
    } catch (error) {
        throwError500(res, error);
    }
}

exports.createUser = async function (req, res) {
    const { firstName, lastName } = req.body;
    if (typeof firstName !== "string") {
        res.status(400).json({ error: 'firstName must be a string' });
    } else if (typeof lastName !== "string") {
        res.status(400).json({ error: 'lastName must be a string' });
    }

    const userId = randomUUID()
    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId, firstName, lastName
        },
    };

    try {
        await dynamoDB.put(params);
        res.json({
            message: "User created successfully",
            data: params.Item
        });
    } catch (error) {
        throwError500(res, error);
    }
}

exports.updateUser = async function (req, res) {
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
        await dynamoDB.put(params);
        res.json({
            message: "User updated successfully",
            data: params.Item
        });
    } catch (error) {
        throwError500(res, error);
    }
}
