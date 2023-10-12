const exp=require('express')
const User = require('../models/users');
const { valid, userScheme } = require('../validation');
const userRouter=exp.Router()
const bcrypt=require('bcrypt')
// userRouter.get('/',(req,res)=>{
//     res.send("user")
// })
const secret="secret";
const jwt =require('jsonwebtoken');
const { getUser } = require('../middleware/getUser');
userRouter.post('/register',valid(userScheme),async(req,res)=>{
    let inp=req.body;
    console.log(inp)
    await User.syncIndexes()
    let hash=await bcrypt.hash(inp.Password, 2);
    inp.Password=hash
    let myuser=await User.findOne({Username:inp.Username})
    if(!myuser){
    User.insertMany([inp]).then(async val=>{
        let data={id:val[0]._id}
        let token=await jwt.sign(data,secret)
        res.send({token,username:inp.Username});
        return
    })}else{
        res.status(400).send({error:"Username alredy exists"})
        return
    }
    // .catch(err=>{
    //     if(err.code==11000){
    //         res.send("Username alredy exists")
    //     }else{
    //         res.json(err)
    //     }
    // })
})

userRouter.post('/login',async(req,res)=>{
    const {Username,Password}=req.body;
    console.log(Username,Password);
   let myuser= await User.findOne({Username})
   if(!myuser){
    res.status(400).send({error:"Username does'nt exist"})
    return
   }
   let result=await bcrypt.compare(Password,myuser.Password)
   if(result){
    let token=await jwt.sign({
        id:myuser._id
    },secret)
    res.send({token,username:myuser.Username})
    return
   }else{
    res.status(400).send({error:"Username or password is incorrect"})
    return
   }
})

userRouter.get('/getuser',getUser,(req,res)=>{
    res.send(req.user)
})

userRouter.get('/getVisited',getUser,(req,res)=>{
    res.send({visited:req.user.visited||[null]})
})

userRouter.get('/getFav',getUser,(req,res)=>{
    res.send({starred:req.user.starred||[null]})
})

userRouter.get('/getLiked',getUser,(req,res)=>{
    res.send({liked:req.user.liked||[null]})
})

userRouter.post('/addToFav',getUser,async (req,res)=>{
    if(req.user){
        // let currentStar=req.user.starred;
        // console.log(currentStar);
        // currentStar[req.body.newsUrl]=1;
        let doc=await User.findById(req.user._id);
        if(!doc.starred.find((e)=>e.url==req.body.news.url)){

            await User.findByIdAndUpdate(req.user._id,{$push:{starred:req.body.news}})
        }
        res.send({status:"done"})
    }else{
        res.send({status:"error"})
    }
})

userRouter.post('/delFromFav',getUser,async (req,res)=>{
    if(req.user){
        await User.findByIdAndUpdate(req.user._id,{$pull:{starred:{url:req.body.newsUrl}}})
        res.send({status:"done"})
    }else{
        res.send({status:"error"})
    }
})

userRouter.post('/addToSeen',getUser,async (req,res)=>{
    if(req.user){
        let currentVis=req.user.visited;
        currentVis[req.body.newsUrl]=1;
        await User.findByIdAndUpdate(req.user._id,{$push:{visited:req.body.newsUrl}})
        res.send({status:"done"})
    }else{
        res.send({status:"error"})
    }
})

module.exports=userRouter