import express from 'express'
import {
    User
} from '../database/models'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getRefreshKey } from '../authUtil/getKeys'
import { generateAccessToken , generateRefreshToken } from '../authUtil/tokenGenerate'

const userAuthController = express.Router()

let refreshtokens = []

/*POST
 * add a new user to the database
 */
//singup
userAuthController.post('/signup', (req, res) =>{
    const {email, password, username} = req.body
    bcrypt.hash(password, 10, (err, pass) =>{
        if(err){
            res.status(500).json({
                error : err
            })
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
                    res.status(500).json(err)
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
            res.sendStatus(404)
        }
        user.comparePassword(password)
        .then(same =>{
            if(!same){
                res.sendStatus(401)
            }
            const userData = {
                _id: user._id,
                username: user.username,
                email: user.email
            }
            const accessToken = generateAccessToken(userData)
            const refreshToken = generateRefreshToken(userData)
            refreshtokens.push(refreshToken)
            res.send({
                message: "Auth Succesful",
                refreshToken,
                accessToken
            })
        })
        .catch(err => {
            res.status(401).json({
                error: err
            })
        })
    })
    .catch(err => {
        res.status(400).json({ error: err })
    })
})

//generate token
userAuthController.post('/token', (req, res) =>{
    const key = getRefreshKey()
    const { refreshToken } = req.body
    if(!refreshtokens.includes(refreshToken)) res.sendStatus(403)
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
    refreshtokens.filter(token => {token != req.body.refreshToken})
    res.sendStatus(200)
})

// exporting the contoller
export default userAuthController

