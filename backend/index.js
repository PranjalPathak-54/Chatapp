import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { connectDB } from './lib/db.js'
import userRouter from './Routes/userRoutes.js'
import messageRouter from './Routes/messageRoutes.js'

const app=express()

export const userSocketmap={}
export const io={
    to:()=>({ emit:()=>{} }),
    emit:()=>{}
}

app.use(express.json({limit:"4mb"}))
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}))

app.use("/api/status",(req,res)=>res.send("Server is Live"));
app.use("/api/auth",userRouter)
app.use('/api/messages',messageRouter)

connectDB();

export default app;
