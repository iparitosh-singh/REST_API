import jwt from 'jsonwebtoken'
import { getAccessKey, getRefreshKey } from './getKeys'

export const verifyAccesstoken = (token) =>{
    let key = getAccessKey()
    return new Promise( (resolve, reject) =>{
        jwt.verify(
            token,
            key,
            ((err , data) => {
                if(err) {
                    reject(err)
                }
                resolve(data)
            })
        )
    })
}

export const verfiyRefreshToken = (token) => {
    let key = getRefreshKey()
    return new Promise( (resolve, reject) =>{
        jwt.verify(
            token,
            key,
            ((err , data) => {
                if(err) {
                    reject(err)
                }
                resolve(data)
            })
        )
    })
}
