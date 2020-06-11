import express from 'express'
import mongoose from 'mongoose'
import {
    userController
} from './controller'


const app =  express()

app.use(express.json())
app.use(express.urlencoded({extended: false }))

const port = process.env.port || 4000


app.use('/api', userController)

app.listen(port, () =>{
    console.log(`Now listening on port ${port}`)
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

