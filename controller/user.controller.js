import express from 'express'
const userController = express.Router()
import {
    User
} from '../database/models'
import sha256 from 'sha256'

/* GET
 * all the users in the User model
 */
userController.get('/users', (req, res) =>{
    User.find({} , (err , result) => {
        res.status(200).json({
            data: result
        })
    })
})

userController.get('/user/:id', (req, res) =>{
    let id = req.param.id
    User.findById({_id: req.params.id})
    .then((user) =>{
        res.send(user)
    })
})


/*POST
 * add a new user to the database
 */
userController.post('/add-user', (req, res) =>{
    const {email, password, username} = req.body
    const UserData = {
        email,
        username,
        hashedPassword: sha256(password)
    }
    const newUser = new User(UserData)
    newUser
        .save()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            res.status(400).send({ error : err, message : "Unable to save to database"})
        })
})
/*PUT
 * to update the values of user
 */
userController.put('/edit-user/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => {
        User.findById(req.params.id)
        .then((updatedUser) =>{
            res.send({
                updated: updatedUser,
                old: data
            })
        })
    })
    .catch((err => { res.send(err)}))
})

// exporting the contoller
export default userController
