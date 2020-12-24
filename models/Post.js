const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create DB schema
const PostSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    text : {
        type: String,
        required: true
    },
    name : {
        type: String
    },
    avatar : {
        type: String
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "Users"
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "Users"
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model("post", PostSchema)

module.exports = Post