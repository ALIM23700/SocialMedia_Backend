const express=require("express")
const cookieParser = require("cookie-parser")
const bodyparser=require("body-parser")
const cores=require("cors")

const router1 = require("./routes/user.route")
const router2 = require("./routes/post.route")
const router3 = require("./routes/reel.route")
const router4 = require("./routes/story.route")
const connectDB=require("../Backend/Models/db.model")





const app=express()


connectDB()
//middleware
app.use(cores())

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.json())
app.use(cookieParser())

//routes

app.use("/api/v1/",router1)

app.use("/api/v1/",router2)
app.use("/api/v1/",router3)
app.use("/api/v1/",router4)

app.get("/",(req,res)=>{
    res.send("i am home page")

})
module.exports=app