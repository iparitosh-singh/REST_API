import { Schema } from 'mongoose'
const PostSchema = new Schema ({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    text: {
        type: String
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    author: {
        index: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    comments: {
        type: String,
        created: {
            type: Date,
            default : Date.now
        },
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    }
})

export default PostSchema
