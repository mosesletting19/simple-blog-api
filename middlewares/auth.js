// middlewares/auth.js

const jwt = require('jsonwebtoken');
const userModel = require('../models/users');
require('dotenv').config();

const authenticateUser = async (req, res, next) => {
    // ... (authentication logic)
};

module.exports = {
    authenticateUser,
};