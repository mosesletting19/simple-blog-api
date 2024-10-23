// routes/userRouter.js

const express = require('express');
const controller = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup', controller.createUser);
userRouter.post('/login', controller.login);

module.exports = userRouter;