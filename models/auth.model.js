const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    isOnline:{
        type:Boolean,
        default:false
    }
},{ timestamps: true })
module.exports=mongoose.model("user",userSchema)