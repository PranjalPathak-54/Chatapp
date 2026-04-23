import { createContext, useContext, useEffect, useState } from "react";
import { Authcontext } from "./Authcontext";
import axios from 'axios'
import toast from 'react-hot-toast'
export const Chatcontext=createContext()

export const ChatProvider=({children})=>{
    const [messages,setmessages]=useState([])
    const [user,setusers]=useState([])
    const [selecteduser,setselecteduser]=useState(null)
    const [unseenmessages,setunseenmessages]=useState({})
    const {socket}=useContext(Authcontext)
    const getUsers=async()=>{
        try{
        const {data}=await axios.get('/api/messages/users')
        if(data.success){
            setusers(data.users)
            setunseenmessages(data.unseenmessages)
        }
    }
    catch(error){
        toast.error(error.message)
    }
    }
    const getMessages=async(userId)=>{
        try{
            const {data}=await axios.get(`/api/messages/${userId}`)
            if(data.success){
                setmessages(data.messages)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }
    const sendMessages=async(messageData)=>{
        try{
            const {data}=await axios.post(`/api/messages/send/${selecteduser._id}`,messageData)
            if(data.success){
                setmessages((prevMessages)=>[...prevMessages,data.newMessage])
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }
    const subscribetoMessage=async()=>{
        if(!socket) return;
        socket.on("newMessage",(newMessage)=>{
            if(selecteduser && newMessage.senderId===selecteduser._id){
                newMessage.seen=true
                setmessages((prevMessages)=>[...prevMessages,newMessage])
                axios.put(`/api/messages/mark/${newMessage._id}`)
            }
            else{
                setunseenmessages((prevUnseenmessages)=>({
                    ...prevUnseenmessages,[newMessage.senderId]:
                    prevUnseenmessages[newMessage.senderId] ? prevUnseenmessages[newMessage.senderId]+1:1
                }))
            }
        })
    }
    const unsubscribetoMessage=()=>{
        if(socket) socket.off("newMessage")
    }
    useEffect(()=>{
        subscribetoMessage();
        return ()=>unsubscribetoMessage()
    },[socket,user])
    const value={
       messages,user,selecteduser,getUsers,getMessages,sendMessages,setselecteduser,unseenmessages,setunseenmessages
    }
    return (
        <Chatcontext.Provider value={value}>
            {children}
        </Chatcontext.Provider>
    )
}