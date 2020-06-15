import jwt from 'jsonwebtoken'
import {getAccessKey , getRefreshKey} from './getKeys'

export const generateAccessToken = (payload) =>{
    const key = getAccessKey()
    return jwt.sign(
        payload,
        key,
        { expiresIn : '10m'},
    )
}

export const generateRefreshToken = (payload) =>{
    const key = getRefreshKey()
    return jwt.sign(
        payload,
        key
    )
}
