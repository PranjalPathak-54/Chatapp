import React,{useState,useContext} from 'react'
import Container from '../components/Container'
import RightSide from '../components/RightSide'
import Sidebar from '../components/Sidebar'
import { Chatcontext } from '../context/Chatcontext'

const Home = () => {
    const [user,setuser]=useState(false)
    const {selecteduser}=useContext(Chatcontext)
    return (
        <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
            <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selecteduser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]':'md:grid-cols-2'}`}>
                <Sidebar/>
                <Container/>
                <RightSide/>
            </div>
        </div>
    )
}

export default Home