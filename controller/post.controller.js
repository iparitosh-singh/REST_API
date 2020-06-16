import express from 'express'
import {
    Post
} from '../database/models'
import checkAuth from '../authUtil/check_auth'


const postController = express.Router()

/* GET
 * get the posts
 */
postController.get('/all', (req, res) => {
    Post.find({})
    .then(posts =>{
        res.status(200).json({
            posts,
        })
    })
})

postController.get('/yourpost', checkAuth, (req, res) =>{
    Post.find({author: req.userData._id})
    .then(posts =>{
        res.status(200).json({
            posts,
        })
    })
    .catch(err => {
        res.status(400).json({
            error: err
        })
    })
})

/* POST
 * make a post and comments
 */
postController.post('/add-post', checkAuth, (req, res) =>{
    const { title, text, photo } = req.body
    let post = {
        title,
        text,
        photo
    }
    post.author = req.userData._id
    const newPost = new Post(post)
    newPost
        .save()
        .then(data =>{
            res.status(201).send({
                message: "Post Created",
                post: {
                    data
                }
            })
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

postController.post('/add-comment', checkAuth, (req, res) =>{
    const { postId } = req.body
    const comment = {
        text: req.body.text,
        postedBy: req.userData._id
    }
    Post.findOne({_id: postId })
    .then(post =>{
        if(!post){
            res.status(404).send({
                message: "No post found"
            })
        }
        post.comments.push(comment)
        post.save()
        .then(updatedPost => {
            res.status(201).send({
                comments: updatedPost.comments
            })
        })
    })
})

export default postController
