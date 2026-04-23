import Message from "../Models/Message.js";
import User from "../Models/User.js";
import cloudinary from '../lib/cloudinary.js'
import { io,userSocketmap } from "../index.js";
export const getUserforSidebar=async(req,res)=>{
    try{
        const userId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:userId}}).select('-password')
        const unseenmessages={}
        const promises=filteredUsers.map(async(user)=>{
            const messages=await Message.find({senderId:user._id,receiverId:userId,seen:false})
            if(messages.length>0){
                unseenmessages[user._id]=messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success:true,users:filteredUsers,unseenmessages})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

export const getmessages=async(req,res)=>{
    try{
        const {id:selectedUserId}=req.params;
        const myId=req.user._id;
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId},
            ]
        })
        await Message.updateMany({senderId:selectedUserId,receiverId:myId},{seen:true});
        res.json({success:true,messages})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

export const markMessageseen=async(req,res)=>{
    try{
        const {id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

export const sendMessage=async(req,res)=>{
    try{
    const {text,image}=req.body;
    const receiverId=req.params.id;
    const senderId=req.user._id;
    let imageurl;
    if(image){
       const uploadResponse=await cloudinary.uploader.upload(image)
       imageurl=uploadResponse.secure_url;
    }
    const newMessage=await Message.create({
        senderId,
        receiverId,
        text,
        image:imageurl,
    })
    const recieverSocketId=userSocketmap[receiverId]
    if(recieverSocketId){
        io.to(recieverSocketId).emit("newMessage",newMessage)
    }
    res.json({success:true,newMessage})
}
catch(error){
    console.log(error.message)
    res.json({success:false,message:error.message})
}
}
