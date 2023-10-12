const mongoose=require('mongoose')
const exp=require('express');
const cors=require('cors')
var bodyParser     =         require("body-parser");
const userRouter = require('./routes/users');
const likeRouter = require('./routes/likes');
// const noteRouter = require('./routes/notes');
const app=exp();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())
app.use(exp.urlencoded({extended:true}))
app.use(exp.json())
mongoose.connect('mongodb://127.0.0.1:27017/myNews')
.then(()=>{
    console.log("connected")
})
.catch(err=>{
    console.log("Connection Error :",err)
})

app.use("/users",userRouter)
app.use("/likes",likeRouter)
app.get("/",(req,res)=>{
    res.send("hello!!")
})



app.listen(80,()=>{
    console.log("http:/localhost:80")
})