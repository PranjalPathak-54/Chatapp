import User from "../Models/User.js";
import jwt from 'jsonwebtoken'

export const protectedRoute=async(req,res,next)=>{
    try{
        const token=req.headers.token;
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.json({success:false,message:"User Not Found"})
        }
        req.user=user;
        next();
    }
    catch(error){
       console.log(error.message)
       res.json({success:false,message:error.message})
    }
}

export const checkAuth=async(req,res,next)=>{
    res.json({success:true,user:req.user})
}