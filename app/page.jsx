"use client";

import AuthLayout from "@/components/AuthLayout";
import { useDataContext } from "@/context/DataProvider";
import { base_api_path } from "@/utils/reportList";
import axios from "axios";
import { useRouter, } from 'next/navigation'
import { useEffect, useState } from "react";
// 
export default function LoginAdmins() {
  const {theme_bg,main_school_info, dispatch} = useDataContext()
  const [value, setValue] = useState({sscar_code:'', password:'', is_loading:false, error:''})

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
         
         setValue({...value, error:'incorrect cridentials'})
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
         <div className='my-2 px-2'>
            {value.error && <p className="text-xs py-1 px-2 text-red-600 w-full bg-red-200 border border-red-600">{value.error}</p>}
         </div>
         <div className='my-2 border px-2'>
            <input value={value.sscar_code} onChange={(e)=>setValue({...value, sscar_code:e.target.value})} type="text"className="p-1 text-sm w-full" placeholder='Your school Sscar code' style={{outline:'none'}}/>
         </div>
         <div className='my-2 border px-2'>
           <input value={value.password} onChange={(e)=>setValue({...value, password:e.target.value})} type="text" className="p-1 text-sm w-full" placeholder='Password' style={{outline:'none'}}/>
         </div>
         <button disabled={value.is_loading} style={{background:theme_bg, color:'white'}} className='p-1 text-sm w-full rounded mt-2'>{value.is_loading?'Sending...':'Login'}</button>
      </form>
   </div>
   </AuthLayout>
  )
}
