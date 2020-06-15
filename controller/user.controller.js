import express from 'express'
import {
    User
} from '../database/models'
import checkAuth from '../authUtil/check_auth'

const userController = express.Router()

/* GET
 * all the users in the User model
 */
userController.get('/', (req, res) =>{
    User.find({})
    .then(users =>{
        res.status(200).json({
            users,
        })
    })
})

userController.get('/user/profile', checkAuth, (req, res) =>{
    let id = req.body.id
    User.findById(id)
    .then((user) =>{
        res.send(user)
    })
})

/*PUT
 * to edit the data of the current user
 */
userController.put('/edit-user', checkAuth, (req, res) =>{
    let id = req.userData._id
    User.findByIdAndUpdate(id, {username: req.body.username })
    .then(user =>{
        let newUser = {}
        User.findById(user._id)
        .then(newuser =>{
            newUser = newuser
            res.status(201).json({
                modified: newUser,
                old: user
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    })
})

/*DELETE
 * to delete the user
 */
userController.delete('/user_delete/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(data =>{
        res.status(200).json({
            user: data,
            message: 'User deleted'
        })
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    })
})

export default userController

