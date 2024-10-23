// routes/blogRouter.js

const express = require('express');
const controller = require('../controllers/blogController');
const auth = require('../middlewares/auth');

const blogRouter = express.Router();

blogRouter.use(auth.authenticateUser); // Requires authentication for all routes

blogRouter.post('/create', controller.createBlog);
blogRouter.get('/', controller.getAllBlogs);
blogRouter.get('/:_id', controller.getOneBlog);
blogRouter.put('/update/:_id', controller.updateBlog);
blogRouter.delete('/:_id', controller.deleteBlog);

module.exports = blogRouter;