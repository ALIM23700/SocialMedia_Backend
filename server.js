
const express=require("express")
const cookieParser = require("cookie-parser")
const bodyparser=require("body-parser")
const cores=require("cors")
const dotenv=require("dotenv")
const router1 = require("./routes/user.route")
const router2 = require("./routes/post.route")
const router3 = require("./routes/reel.route")

dotenv.config()




const app=express()
const PORT=process.env.PORT || 3000


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

app.get("/",(req,res)=>{
    res.send("i am home page")

})
app.listen(PORT,()=>{
    console.log(`server is running at:http://localhost:${PORT}`)
})