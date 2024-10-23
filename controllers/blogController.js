// controllers/blogController.js

const blogModel = require('../models/blogs');

const createBlog = async (req, res) => {
    try {
        const {
            title,
            description,
            tag,
            author,
            timestamp,
            state,
            read_count,
            reading_time,
            body,
        } = req.body;
        const user_id = req.user_id;



        const existingBlog = await blogModel.findOne({
            title: title,
            description: description,
            tag: tag,
            author: author,
            state: state,
            user_id: user_id,
            body: body,
        });


        const blog = await blogModel.create({
            title: title,
            description: description,
            tag: tag,
            author: author,
            state: state,
            user_id: user_id,
            body: body,
        });

        res.status(302).redirect("/dashboard");
    } catch (error) {
        console.log(error);
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const user_id = req.query.user_id;
        const totalBlogs = await blogModel.countDocuments();
        // Get page and limit from query string
        let page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20; // Set default limit

        const totalPages = Math.ceil(totalBlogs / limit);

        if (page < 1) {
            page = 1;
        } else if (page > totalPages) {
            page = totalPages;
        }

        // Calculation of  skip value
        const skip = (page - 1) * limit;

        // Fetch blogs based on pagination parameters
        const blogs = await blogModel.find().skip(skip).limit(limit);

        for (let i = 0; i < blogs.length; i++) {
            const blog = blogs[i];
            blog.read_count = parseInt(blog.read_count) + 1;
            await blog.save();

            // Checking  if the blog is published and has a publishedAt date
            if (blog.state === 'published' && blog.publishedAt) {
                blog.publishedDate = blog.publishedAt.toDateString(); // Format the date as needed
            } else {
                blog.publishedDate = 'Not published yet';
            }
        }

        const users = await blogModel.find({ user_id });

        res.render("allblogs", { user_id: user_id, users: users, totalPages: totalPages, page: page, totalBlogs: totalBlogs, limit: limit, blogs: blogs, date: new Date() });
    } catch (error) {
        console.log(error);
        res.status(400);
    }
};


const getOneBlog = async (req, res) => {
    try {
        const blogId = req.params._id;
        const blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Incrementing the read_count by 1
        blog.read_count = parseInt(blog.read_count) + 1;
        await blog.save();

        // Check if the blog is published and has a publishedAt date
        let publishedDate = 'Not published yet';
        if (blog.state === 'published' && blog.publishedAt) {
            publishedDate = blog.publishedAt.toDateString(); // Format the date as needed
        }

        // Fetch the user information
        const user_id = blog.user_id;
        const user = await userModel.findById(user_id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.render("blog", { user_id: user_id, user: user, blog: blog, publishedDate: publishedDate, date: new Date() });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const updateBlog = async (req, res) => {
    try {
        // Extract the blog post ID from the request parameters
        const postId = req.params._id;

        // Retrieve the existing blog post from the database
        const existingBlogPost = await blogModel.findById(postId);

        if (!existingBlogPost) {
            return res.status(302).redirect("/create");
        }

        // Update the fields of the existing blog post
        existingBlogPost.title = req.body.title;
        existingBlogPost.description = req.body.description;
        existingBlogPost.tag = req.body.tag;
        existingBlogPost.author = req.body.author;
        existingBlogPost.state = req.body.state;
        existingBlogPost.body = req.body.body;

        if (req.body.state === 'published' && !existingBlogPost.publishedAt) {
            // Set the publishedAt date if the state is changed to 'published'
            existingBlogPost.publishedAt = new Date();
        }

        // Save the updated blog post
        const updatedBlogPost = await existingBlogPost.save();

        res.status(302).redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const deleteBlog = async (req, res) => {
    try {
        const postId = req.params._id;

        // Deleting the blog post from the database
        const deletedBlogPost = await blogModel.findByIdAndDelete(postId);

        if (!deletedBlogPost) {
            return res.status(404).json({ message: "blog not found" });
        }

        res.status(302).redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getOneBlog,
    updateBlog,
    deleteBlog,
};
