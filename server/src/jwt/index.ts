import  jwt  from "jsonwebtoken";
import {Request,Response,NextFunction} from 'express'

//GenerateToken
function generateAccessToken(data : object){
    return jwt.sign({data},process.env.ACCESS_TOKEN_SECRET || 'Mwragaerrgvbag4vddddeefwefwefw', { expiresIn: '1h' })
}

//AuthenticateAcessToken
function authenticateToken(req : Request ,res : Response ,next : NextFunction){
    let token = req.headers.authorization;
    if(!token){
        return res.status(401).send("Access denied")
    } 
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET || 'Mwragaerrgvbag4vddddeefwefwefw',(err,result)=>{

            if(err){
                return res.status(401).send("Access denied")
            }
            req.body.data = result
            next() 
    })
}
module.exports = {
    generateAccessToken,
    authenticateToken
} 