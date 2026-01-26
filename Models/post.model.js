const mongoose=require('mongoose')

const postSchima=new mongoose.Schema({
      user:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
           required:true,
          },
      mediaType:{
           type:String,
           enum:["image","video"],
           required:true,
 
         },
         mediaUrl:{
           type:String,
           required:true,
 
         },
         caption:{
           type:String,
          },
        likes:[
            {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
         
          }],
        comments:[
            {
                 user: {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
         },
         text:String,
         createAt:Date,
            }

        ],
          

},{timestamps:true})
const Post=mongoose.model('Post',postSchima)
module.exports=Post