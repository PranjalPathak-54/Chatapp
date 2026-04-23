import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Authprovider } from './context/Authcontext.jsx'
import { ChatProvider } from './context/Chatcontext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <Authprovider>
    <ChatProvider>
      <App />
    </ChatProvider>
   </Authprovider>
  </BrowserRouter>,
)
