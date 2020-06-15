import mongoose from 'mongoose'
import PostSchema from '../schemas/post.schema'

const Post = mongoose.model('Post', PostSchema)

export default Post
