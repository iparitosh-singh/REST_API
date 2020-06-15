import { verifyAccesstoken } from './verifytoken'

const checkAuth =  (req, res, next) =>{
    const { accessToken } = req.body
    verifyAccesstoken(accessToken)
    .then(data =>{
        req.userData = data
        next()
    })
    .catch(err =>{
        res.status(401).json({
            error: err,
            message: "Not a valid token"
        })
    })
}

export default checkAuth
