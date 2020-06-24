import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {
    userAuthController
} from './controller'


const app =  express()

app.use(express.json())
app.use(express.urlencoded({extended: false }))
app.use(cors())

const port = 6969

app.use('/auth', userAuthController)

app.use((err, req, res, next) => {

})
app.listen(port, () =>{
    console.log(`Auth server started on port:${port}`)
    mongoose.connect('mongodb://localhost/Tictactoe',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    mongoose.connection
        .once('open' , () => console.log('conneted'))
        .on('error' , (err) =>{
            console.log(err)
        })
})



