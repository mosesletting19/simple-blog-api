// controllers/userController.js

const userModel = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const createUser = async (req, res) => {
    const { first_name, last_name, email, password, country } = req.body;
    try {
        const existingUser = await userModel.findOne({
            email: email,
        });

        if (existingUser) {
            return res.redirect("/existinguser");
        }

        const user = await userModel.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            country: country,
        });

        const JWT_SECRET = process.env.JWT_SECRET;
        const token = await jwt.sign(
            { first_name: user.first_name, email: user.email, _id: user._id },
            JWT_SECRET
        );
        res.status(302).redirect("/login");
    } catch (error) {
        console.log(error);
        res.status(500).message("Internal Server Error");
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({
            email: email,
        });
        // console.log(user)

        if (!user) {
            return res.status(404).redirect("/signup");

        }

        const validPassword = await user.isValidPassword(password);
        console.log(email);

        if (!validPassword) {
            return res.status(302).redirect("/unknown");

        }

        const token = await jwt.sign({ user: user }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("token", token, { httpOnly: true }, { maxAge: 60 * 60 * 1000 });
        res.status(200).redirect("/create");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    createUser,
    login,
};
