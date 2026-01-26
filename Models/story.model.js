const mongoose=require('mongoose')

const storySchima=new mongoose.Schema({
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
         viewers:[
            {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User",
         
          }],
       
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
        expireAt:{
            type:Date,
            default:()=> new Date(Date.now()+24*60*60*1000),
            expires:0
        }
          

},{timestamps:true})
const Story=mongoose.model('Story',storySchima)
export default Story;
