import { useState, useEffect, createContext } from "react";
import toast from "react-hot-toast";
import axios from 'axios'
import { io } from 'socket.io-client'
const backendurl=import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL=backendurl
export const Authcontext=createContext()

export const Authprovider=({children})=>{
    const [token,settoken]=useState(localStorage.getItem("token"))
    const [authUser,setauthUser]=useState(null)
    const [onlineUsers,setonlineUsers]=useState([])
    const [socket,setsocket]=useState(null)
    const checkAuth=async()=>{
        try{
            const {data}=await axios.get("/api/auth/check")
            if(data.success){
                setauthUser(data.user)
                connectSocket(data.user)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }
    const connectSocket=(userData)=>{
        if(!userData||socket?.connected) return;
        const newSocket=io(backendurl,{
            query:{
               userId:userData._id,
            }
        });
        newSocket.connect()
        setsocket(newSocket)
        newSocket.on("getOnlineUsers",(userId)=>{
            setonlineUsers(userId)
        })
    }
    const login=async(state,credentials)=>{
        try{
            const {data}=await axios.post(`/api/auth/${state}`,credentials)
            if(data.success){
                setauthUser(data.userData)
                connectSocket(data.userData)
                axios.defaults.headers.common['token']=data.token
                settoken(data.token)
                localStorage.setItem("token",data.token)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }
    const logout=async()=>{
       localStorage.removeItem("token")
       settoken(null)
       setauthUser(null)
       setonlineUsers([])
       axios.defaults.headers.common["token"]=null
       toast.success("Logged Out")
       socket.disconnect()
    }
    const updateProfile=async(body)=>{
        try{
            const {data}=await axios.put("/api/auth/update-profile",body)
            if(data.success){
                setauthUser(data.user)
                toast.success("Profile Updated")
            }
        }
        catch(error){
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['token']=token
            checkAuth();
        }
    },[])
    const value={
      axios,
      authUser,
      onlineUsers,
      socket,
      login,
      logout,
      updateProfile
    }
    return(
        <Authcontext.Provider value={value}>
            {children}
        </Authcontext.Provider>
    )
}