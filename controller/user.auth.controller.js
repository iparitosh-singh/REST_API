import express from 'express'
import {
    User
} from '../database/models'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getRefreshKey } from '../authUtil/getKeys'
import { generateAccessToken , generateRefreshToken } from '../authUtil/tokenGenerate'

const userAuthController = express.Router()

let refreshtokens = {}

/*POST
 * add a new user to the database
 */
//singup
userAuthController.post('/signup', (req, res) =>{
    const {email, password, username} = req.body
    bcrypt.hash(password, 10, (err, pass) =>{
        if(err){
            res.status(500).send(err)
        }
        else{
            const UserData = {
                email,
                username,
                hashedPassword: pass
            }
            const newUser = new User(UserData)
            newUser
                .save()
                .then(data => {
                    res.status(201).send({
                        message: "User Created",
                        user: {
                            data
                        }
                    })
                })
                .catch(err => {
                    res.status(500).send(err)
                })
        }
    })
})


//login
userAuthController.post('/login', (req, res) => {
    const { email, password } = req.body
    User.findOne({email})
    .then(user =>{
        if(!user){
            res.status(401).send('No user found')
        }
        user.comparePassword(password)
        .then(same =>{
            if(!same){
                res.status(401).send('passoword do not match')
            }
            const userData = {
                _id: user._id,
                username: user.username,
                email: user.email
            }
            const accessToken = generateAccessToken(userData)
            const refreshToken = generateRefreshToken(userData)
            refreshtokens[refreshToken] = userData
            res.send({
                refreshToken,
                accessToken
            })
        })
        .catch(err => {
            res.status(401).send(err)
        })
    })
    .catch(err => {
        res.status(400).send(err)
    })
})

//generate token
userAuthController.post('/token', (req, res) =>{
    const key = getRefreshKey()
    const { refreshToken } = req.body
    if(!(refreshToken in refreshtokens)) res.sendStatus(403)
    const user = jwt.verify(refreshToken, key)
    const userData = {
        username: user.username,
        email: user.email
    }
    const accessToken = generateAccessToken(userData)
    res.send({
        accessToken,
    })
})

/*DELETE
 * to delete data from the server
 */
//logout
userAuthController.delete('/logout', (req, res) => {
    const { refreshToken } = req.body
    if(refreshToken in refreshtokens) {
        delete refreshtokens[refreshToken]
    }
    res.sendStatus(204)
})

// exporting the contoller
export default userAuthController

