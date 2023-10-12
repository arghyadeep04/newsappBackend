// const { string } = require("joi")
const mongoose=require("mongoose")
const likedSchma= new mongoose.Schema({
    newsUrl:{type:String},
    likedBy:[{type:mongoose.Types.ObjectId,ref:"User"}]
})
// userSchma.plugin(passport)
const Liked=mongoose.model('Liked',likedSchma)
module.exports=Liked