import React,{useState} from 'react'
import assets from '../assets/assets'
import { Authcontext } from '../context/Authcontext'
import { useContext } from 'react'
const Login = () => {
  const [state,setstate]=useState('Signup')
  const [name,setname]=useState("")
  const [email,setemail]=useState("")
  const [password,setpassword]=useState("")
  const [bio,setbio]=useState("")
  const [datasubmitted,setdatasubmitted]=useState(false)
  const {login}=useContext(Authcontext)
  const onSubmithandler=(e)=>{
    e.preventDefault()
    if(state==='Signup' && !datasubmitted){
      setdatasubmitted(true)
      return;
    }
    login(state==="Signup" ? 'signup':'login',{fullName:name,email,password,bio})
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} className='w-[min(30vw,250px)]'/>
      <form onSubmit={onSubmithandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
         <h2 className='font-medium text-2xl flex justify-between items-center'>
          {state}
          {datasubmitted && <img onClick={()=>setdatasubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer'/>}
         </h2>
         {state==='Signup' && !datasubmitted &&(<input type="text" onChange={(e)=>setname(e.target.value)} className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' value={name} required/>)}
         {
          !datasubmitted && (
            <>
             <input type="email" onChange={(e)=>setemail(e.target.value)} value={email }placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
             <input type="password" onChange={(e)=>setpassword(e.target.value)} value={password} placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
            </>
          )
         }
         {state==='Signup' && datasubmitted && (
          <textarea rows={4} onChange={(e)=>setbio(e.target.value)} value={bio} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Provide a short bio' required/>
         )}
         <button type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>{state==='Signup'?"Create Account":"Login Now"}</button>
         <div className='flex items-center gap-2 text-sm text-gray-500'>
           <input type="checkbox"/>
           <p>Agree to Terms & Conditions</p>
         </div>
         <div className='flex flex-col gap-2'>
           {state==='Signup' ? (
            <p onClick={()=>{setstate('Login');setdatasubmitted(false)}}className='text-sm text-gray-600'>Already Have an account? <span className='font-medium text-violet-500 cursor-pointer'>Login Here</span></p>
           ):(
             <p  onClick={()=>{setstate('Signup');setdatasubmitted(false)}} className='text-sm text-gray-600'>Don't Have an account? <span className='font-medium text-violet-500 cursor-pointer'>Register Here</span></p>
           )}
         </div>
      </form>
    </div>
  )
}

export default Login