const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const generateAccessToken =(user) => {
    return jwt.sign({id: user.id,role:user.role,},"access_secret",{
        expiresIn :"15m",
    });
};

const generateRefreshToken = (user) =>{
    return jwt.sign({id: user.id,role:user.role,},"refresh_secret",{
        expiresIn:"7d",
    });

};

const signup = async(req,res) =>{
    const {email,password} = req.body;

    const hashed = await bcrypt.hash(password,10);
    const user = await userModel.createUser(email,hashed);

    res.json(user);
}

const login = async(req,res) =>{
    const {email,password} = req.body;

    const user = await userModel.findUserByEmail(email);
    if(!user) {
        return res.status(400).json({error:"user not found"});
    };

    const match = await bcrypt.compare(password,user.password);
    if(!match) {
        return res.status(400).json({error: "wrong password"});
    };

   

if (user.role === "worker") {
  await userModel.setWorkerOnline(user.id, true);
}

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await userModel.saveRefreshToken(user.id,refreshToken);

    res.json({
  accessToken,
  refreshToken,
  user: {
    id: user.id,
    email: user.email,
    role: user.role,
  },
});
};

const refresh = async(req,res) =>{
    const {refreshToken} = req.body;

    if(!refreshToken) {
        return res.status(401).json({error: "no refresh token"});
    }

    try {
        const decoded = jwt.verify(refreshToken,"refresh_secret");

        const user = await userModel.findUserById(decoded.id);

        if(user.refresh_token !== refreshToken) {
            return res.status(403).json({error: "invalid refresh token"});
        }

        const newAccessToken = generateAccessToken(user);

        res.json({accessToken:newAccessToken});
    } catch {
        res.status(403).json({error:"invalid refresh token"});
    }

};

const logout = async (req,res) => {
    const userId = req.user.id;

    await userModel.saveRefreshToken(userId,null);

    
    await userModel.setWorkerOnline(userId, false);

    


    res.json({message: "logged out"});
};
module.exports = { signup, login,refresh,logout};