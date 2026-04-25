const jwt = require("jsonwebtoken")

function authMiddleware(req,res,next){
    try{
        const token= req.headers.authorization
        if(!token){
            return res.status(401).send("No token provided")
        }
        const actualToken = token.split(" ")[1]
        const decoded = jwt.verify(actualToken,"SECRET_KEY")
        req.user = decoded
        next()
    }catch(error){
        res.status(401).send("invalid token")
    }
}
module.exports = authMiddleware;