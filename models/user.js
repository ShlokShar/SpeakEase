const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    chats: {
        type: [String],
        required: true
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;