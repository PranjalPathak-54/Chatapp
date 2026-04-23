import express from 'express'
import {protectedRoute} from '../Middleware/auth.js'
import { getmessages,getUserforSidebar, markMessageseen, sendMessage } from '../Controllers/messageController.js'

const messageRouter=express.Router()

messageRouter.get('/users',protectedRoute,getUserforSidebar)
messageRouter.get('/:id',protectedRoute,getmessages)
messageRouter.put('/mark/:id',protectedRoute,markMessageseen)
messageRouter.post('/send/:id',protectedRoute,sendMessage)
export default messageRouter;