// db/connect.js

const mongoose = require('mongoose');
require('dotenv').config();

function connectionToMongodb() {
    mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/blogDB');

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connection successful');
    });

    mongoose.connection.on('error', (err) => {
        console.error(err);
        console.log('MongoDB connection unsuccessful');
    });
}

module.exports = { connectionToMongodb };