import express from 'express'
import userController from './user.controller'
import userAuthController from './user.auth.controller'
import postController from './post.controller'

const Router = express.Router()

Router.use('/users', userController)
Router.use('/posts', postController)

export {
    userAuthController,
    Router
}
