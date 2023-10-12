// const { string } = require("joi")
const mongoose=require("mongoose")
const userSchma= new mongoose.Schema({
    Email:{type:String,required:true},
    Username:{type:String,required:true,unique:true},
    Password:{type:String,required:true},
    Date:{type:Date,default:Date.now},
    starred:[{source:{id:String,name:String},author:String,title:String,description:String,url:String,urlToImage:String,publishedAt:String,content:String}],
    visited:[{type:String}],
    liked:[{type:String}]
})
// userSchma.plugin(passport)
const User=mongoose.model('User',userSchma)
module.exports=User