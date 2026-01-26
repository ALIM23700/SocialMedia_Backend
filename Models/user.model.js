const mongoose=require('mongoose')

const userSchima=new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true
   
  },
  phone:{
    type:Number
  },
  profileImage:{
    type:String
  },
  bio:{
    type:String
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  followers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    
  ],
   following:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    
  ],
   savePosts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    
  ],
   posts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    
  ],
   reels:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reels"
    },
    
  ],
   posts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Story"
    },
    
  ]


}
,{timestamps:true})
const User=mongoose.model('User',userSchima)
module.exports= User;
