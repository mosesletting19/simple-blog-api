// models/blogs.js

const mongoose = require('mongoose');
const shortid = require('shortid');

const blogSchema = new schema({

    _id: {
        type: String,
        default: shortid.generate
    },
    title: { type: String, required: false },
    description: { type: String, required: true },
    tag: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    publishedAt: { type: Date },

    state: {
        type: String,
        default: 'draft'
    },
    user_id: {
        type: mongoose.Schema.Types.String,
        ref: "users"
    },
    read_count: { type: Number, required: true, default: 0 },
    reading_time: { type: Number },
    body: { type: String, required: false }

})

blogSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});


const blogModel = mongoose.model("blogs", blogSchema);
module.exports = blogModel;