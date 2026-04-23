import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js'
import userRouter from './Routes/userRoutes.js'
import messageRouter from './Routes/messageRoutes.js'
import { Server } from 'socket.io'
const app=express()
const server=http.createServer(app)
export const io=new Server(server,{
    cors:{origin:'*'}
})
export const userSocketmap={}
io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    console.log("User Conneced",userId)
    if(userId){
        userSocketmap[userId]=socket.id;
    }
    io.emit("getOnlineUsers",Object.keys(userSocketmap))
    socket.on("disconnect",()=>{
        console.log("User disconnected",userId)
        delete userSocketmap[userId]
        io.emit("getOnlineUsers",Object.keys(userSocketmap))
    })
})
app.use(express.json({limit:"4mb"}))
app.use(cors())

app.use("/api/status",(req,res)=>res.send("Server is Live"));
app.use("/api/auth",userRouter)
app.use('/api/messages',messageRouter)
await connectDB()
const PORT=process.env.PORT||5000;
server.listen(PORT,()=>console.log(`Server is running at ${PORT}`))
