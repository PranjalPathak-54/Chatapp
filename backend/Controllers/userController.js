import { generation } from "../lib/utils.js";
import User from "../Models/User.js";
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'
export const signup=async(req,res)=>{
    const {fullName,email,password,bio}=req.body;
    try{
        if(!fullName||!email||!password||!bio){
            return res.json({success:false,message:"Missing Details"})
        }
        const user=await User.findOne({email});
        if(user){
            return res.json({success:false,message:"Account Already Exists"})
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await User.create({
            fullName,email,password:hashedPassword,bio
        });
        const token=generation(newUser._id)
        res.json({success:true,userData:newUser,token,message:"Account Created"})
    }
    catch(error){
       console.log(error.message)
       res.json({success:false,message:error.message})
    }
}

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const userData=await User.findOne({email})
        if(!userData){
            return res.json({success:false,message:"Invalid Credentials"})
        }
        const isPasswordcorrect=await bcrypt.compare(password,userData.password)
        if(!isPasswordcorrect){
            return res.json({success:false,message:"Invalid Credentials"})
        }
        const token=generation(userData._id)
        res.json({success:true,userData,token,message:"Login Successful"});
    }
    catch(error){
       console.log(error.message)
       res.json({success:false,message:error.message})
    }
}

export const updateProfile=async(req,res)=>{
    try{
        const {profilePic,bio,fullName}=req.body;
        const userId=req.user._id;
        let updateUser;
        if(!profilePic){
            updateUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
        }
        else{
            const upload=await cloudinary.uploader.upload(profilePic);
            updateUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})
        }
        res.json({success:true,user:updateUser})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}