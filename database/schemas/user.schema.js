import { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true , "can't be blank"],
        index: true,
        unique: true,
        match: /(?!^[.+&'_-]*@.*$)(^[_\w\d+&'-]+(\.[_\w\d+&'-]*)*@[\w\d-]+(\.[\w\d-]+)*\.(([\d]{1,3})|([\w]{2,}))$)/

    },
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        index: true,
        unique: true
    }
})

UserSchema.methods.comparePassword = function(password){
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.hashedPassword, (err, same) => {
            if(err){
                reject(err)
            } else {
                resolve(same)
            }
        })
    })
}

UserSchema.plugin(uniqueValidator, {message: "is already taken"})

export default UserSchema
