const exp=require('express')
// const User = require('../models/users');
const { valid, userScheme } = require('../validation');
const likeRouter=exp.Router()
const bcrypt=require('bcrypt')
// userRouter.get('/',(req,res)=>{
//     res.send("user")
// })
const secret="secret";
const jwt =require('jsonwebtoken');
const { getUser } = require('../middleware/getUser');
const Liked = require('../models/liked');
const User = require('../models/users');

likeRouter.post('/addToLiked',getUser,async (req,res)=>{
    if(req.user){
        let doc=await Liked.find({newsUrl:req.body.newsUrl})
        console.log(doc)
        let report=0
        if(doc.length!=0){
            if(!doc[0].likedBy.find((e)=>req.user._id.equals(e))){
                report= await Liked.findOneAndUpdate({newsUrl:req.body.newsUrl},{$push:{likedBy:req.user._id}})
                await User.findByIdAndUpdate(req.user._id,{$push:{liked:req.body.newsUrl}})
            }
        }else{
           report= await Liked.insertMany([{newsUrl:req.body.newsUrl,likedBy:[req.user._id]}])
           await User.findByIdAndUpdate(req.user._id,{$push:{liked:req.body.newsUrl}})
        }
        console.log(report);
        res.send({status:"done"})
    }else{
        res.send({status:"error"})
    }
})

likeRouter.post("/removeLike",getUser,async(req,res)=>{
    if(req.user){
        await Liked.findOneAndUpdate({newsUrl:req.body.newsUrl},{$pull:{likedBy:req.user._id}})
        await User.findByIdAndUpdate(req.user._id,{$pull:{liked:req.body.newsUrl}})
        res.send({status:"done"})
    }else{
        res.send({status:"error"})
    }
})

likeRouter.post("/getLikeCount",async(req,res)=>{
    let doc=await Liked.findOne({newsUrl:req.body.newsUrl});
    // console.log("Likers",doc.likedBy)
    res.send( {likers:doc?doc.likedBy:[]})
})

module.exports=likeRouter