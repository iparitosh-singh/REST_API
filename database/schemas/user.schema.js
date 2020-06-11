import { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import sha256 from 'sha256'

const UserSchema = new Schema({
    hashedPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true , "can't be blank"],
        index: true,
        unique: true
    },
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        index: true,
        unique: true
    }
})

UserSchema.methods.comparePassword = (password) =>{
    return this.hashedPassword === sha256(password)
}
UserSchema.plugin(uniqueValidator, {message: "is already taken"})

export default UserSchema
