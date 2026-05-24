const jwt = require("jsonwebtoken");

const authmiddleware = (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({error: "no token"});
    };

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token,"access_secret");
        req.user = decoded;
        next();
    } catch{
        res.status(401).json({error: "invaild token"});
    }
};

module.exports = authmiddleware;

