const User=require('../models/auth.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const key=require('../config/secretkey.config')
exports.signup= async(req,res)=>{
    const userObj={
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        password:req.body.password,
        location:req.body.location
    }
    try{
        const user= await User.create(userObj)
        console.log("user created",user)
        const userCreationResponse={
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            // password:bcrypt.hashSync(req.body.password,8),
            location:req.body.location
        }
        res.status(201).send({msg:"User create successfully",user})
    }
    catch(error){
        console.log(error.message)
        res.status(404).send({msg:"Something went wrong while creating new user"})
    }
}
exports.signin=async(req,res)=>{
    try{
        // console.log("req.body",req.body)
        let user=await User.findOne({uname:req.body.email})
        if(!user){
            return res.status(201).send({
                msg:"User id does not exist"
            })
        }
        const isValidPassword=bcrypt.compareSync(req.body.password,user.password)
        if(!isValidPassword){
            return res.status(201).send({msg:"Password does not match"})
        }
        const token=jwt.sign({_id:user},process.env.SECRET_KEY,{expiresIn:5000})
        const response={
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            location:req.body.location,
            token:token
        }
        res.status(201).send(
            res.redirect('/')
        )
    }catch(error){
        console.log(error.message)
        res.status(404).send({
            msg:"Something went wrong while fetching user"
        })
    }
}