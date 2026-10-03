"use client";

import AuthLayout from "@/components/AuthLayout";
import { useDataContext } from "@/context/DataProvider";
import { base_api_path } from "@/utils/reportList";
import axios from "axios";
import "ldrs/react/Ring.css"
import { Ring } from "ldrs/react";
import { useRouter, } from 'next/navigation'
import { useEffect, useState } from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai'
// 
export default function LoginAdmins() {
  const {theme_bg,main_school_info, dispatch} = useDataContext()
  const [value, setValue] = useState({sscar_code:'', password:'', is_loading:false, error:''})
  const [show_password, setShowPassword] = useState(false)

   const router = useRouter()
   useEffect(()=>{      
      if(main_school_info) return router.push('/home');
   },[])
   //   
  async function loginSchool(e){
      e.preventDefault()
      if(!value.sscar_code || !value.password) return
       let importantData = localStorage.getItem('importantData')
      try {
         setValue({...value, is_loading:true})
         let res = await axios.post(`${base_api_path}school/login-school`, {
            sscar_code:value.sscar_code,
            password:value.password
         })         
         
         if(res.status!==200){
            return setValue({...value, error:'incorrect cridentials'})
         }
         //push school to status, and save jwt to localstorage
                 
         if(!importantData){
            localStorage.setItem('importantData', JSON.stringify({token:res.data?.token}))
         }else{
            let data = JSON.parse(importantData)
            localStorage.setItem('importantData', JSON.stringify({...data, token:res.data?.token}))
            dispatch({type:'TOKEN', payload:res.data?.token})
         }
         // fetch school 
         const school_res = await axios.get(`${base_api_path}school/auth-school`, {
            headers:{
               'Authorization':`Bearer ${res?.data?.token?.access_token}`
               }
            })            
                          
         dispatch({ type: 'MAIN_SCHOOL_INFO', payload: school_res.data?.school }) 
         //redirect
         router.push(`/home`)
         
      } catch (error) {
         console.log(error);
         
         setValue({...value, error:'Incorrect cridentials'})
      }
      
  }
  return (
   <AuthLayout router={router}>
    <div className={`flex justify-center items-center h-screen bg-slate-300 flex-col `}>
      <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Welcome back to Sscar</h3> <br />
      <form onSubmit={loginSchool} className='bg-white h-50 md:w-[50%] w-[90%] md:py-5 py-2 rounded-md px-2'>
         <div className='my-2 px-2'>
            <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Login to your school account</h3>
         </div>
         <h2 className="text-center text-2xl font-semibold text-rose-700 flex justify-center">SIGN IN</h2>
         <div className='my-2 px-2'>
            {value.error && <p className="text-xs py-1 px-2 text-red-600 w-full bg-red-200 border border-red-600">{value.error}</p>}
         </div>
         <div className='my-6'>
            <input value={value.sscar_code} onChange={(e)=>setValue({...value, sscar_code:e.target.value})} type="text"className="p-1 py-2 border focus:border-rose-700 rounded-md text-lg w-full" placeholder='Your school Sscar code' style={{outline:'none'}}/>
         </div>
         <div className='my-6 relative'>
            <input type={show_password?'text':'password'} value={value.password} onChange={(e)=>setValue({...value, password:e.target.value})} className="p-1 py-2 text-lg border focus:border-rose-700 rounded-md w-full" placeholder='Password' style={{outline:'none'}}/>
            {show_password?<AiOutlineEyeInvisible onClick={()=>setShowPassword(prev=>!prev)} className="absolute right-2 text-xl top-4 cursor-pointer text-slate-500 hover:text-slate-800"/>
            :<AiOutlineEye onClick={()=>setShowPassword(prev=>!prev)} className="absolute right-2 text-xl top-4 cursor-pointer text-slate-500 hover:text-slate-800"/>
            }
            
         </div>
         <div className="w-full mx-auto mt-2 rounded-md flex justify-center bg-rose-900">
            {value.is_loading? 
            <Ring size={35} stroke={3} bgOpacity={0} speed={2} color={'white'}/>:
            <button className="bg-transparent rounded-md w-full h-full text-white py-3 hover:bg-rose-800">Sign in</button>
            }
         </div>
      </form>
   </div>
   </AuthLayout>
  )
}
