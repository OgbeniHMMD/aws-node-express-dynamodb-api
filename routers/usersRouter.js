const express = require('express');
const router = express.Router();

const { getAllUsers, getSingleUser, createUser, updateUser } = require('../controllers/usersController');

// GET /users
router.get("/", getAllUsers);

// GET /users/:userId
router.get("/:userId", getSingleUser);

// POST /users
router.post("/", createUser);

// PATCH /users
router.patch("/:userId", updateUser);

module.exports = router;
