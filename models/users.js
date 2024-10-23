// models/users.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new schema({
    _id: {
        type: String,
        default: shortid.generate
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    }, password: { type: String, required: true },
    country: { type: String, required: true },
    profilePicture: { type: String }



})


//before save

userSchema.pre("save", async function (next) {

    const user = this;
    const hash = await bcrypt.hash(user.password, 10);

    this.password = hash;
    next();

})


userSchema.methods.isValidPassword = async function (password) {

    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;

}

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;