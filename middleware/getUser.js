const jwt=require('jsonwebtoken');
const User = require('../models/users');
const secret="secret";

const getUser=async(req,res,next)=>{
    try{
        // console.log(req.header)
    let data= jwt.verify(req.header('userToken'),secret)
    let myuser=await User.findById(data.id);
    req.user=myuser
    next()
    }catch(err){
        res.status(400).send(err)
    }
}

module.exports={getUser}