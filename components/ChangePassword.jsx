'use client'

import { useDataContext } from "@/context/DataProvider";
import { base_api_path } from "@/utils/reportList";
import axios from "axios";
// import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChangePassword({router}) {
  const {theme_bg,dispatch, main_school_info} = useDataContext()
  const [value, setValue] = useState({old_password:'', new_password:'', is_loading:false, error:''})
   

  async function changePassword(e) {
    e.preventDefault()
    if(!value.old_password || !value.new_password) return
    const importantData = localStorage.getItem('importantData')
      let local_data = JSON.parse(importantData)
    try {
      setValue({...value, is_loading:true})
      let res = await axios.post(`${base_api_path}school/change-password`, {
        old_password:value.old_password,
        new_password:value.new_password,
        sscar_code:main_school_info.sscar_code
        }, 
        {headers:{
          'Authorization':`Bearer ${local_data?.token?.access_token}`
          }})
        if(!res.data?.success){
          return setValue({...value, error:'incorrect cridentials'})
        };
        
         // fetch school 
        const school_res = await axios.get(`${base_api_path}school/auth-school`, {
          headers:{
            'Authorization':`Bearer ${local_data?.token?.access_token}`
            }
          })
          dispatch({ type: 'MAIN_SCHOOL_INFO', payload: school_res.data?.school }) 
         //redirect
         Object.keys(router).length>0 && router.push(`/home`)
    } catch (error) {
      console.log(error);
      
    }finally{
      setValue({...value, old_password:'', new_password:'', is_loading:false})
    }
  }
  return (
  
   <div className={`flex justify-center items-center h-screen bg-slate-300 flex-col `}>
        <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Welcome back to Sscar</h3> <br />
        <form onSubmit={changePassword}  className='bg-white h-50 md:w-[50%] sm:w-[90%] md:py-5 py-2 rounded-md px-2'>
            <div className='my-2 px-2'>
               <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Please change your password</h3>
            </div>
            <div className='my-2 px-2'>
              {value.error && <p className="text-xs py-1 px-2 text-red-600 w-full bg-red-200 border border-red-600">{value.error}</p>}
            </div>
            <div className='my-2 border px-2'>
               <input value={value.old_password} onChange={(e)=>setValue({...value, old_password:e.target.value})} type="text"className="p-1 text-sm w-full" placeholder='Old password ' style={{outline:'none'}}/>
            </div>
            <div className='my-2 border px-2'>
               <input value={value.new_password} onChange={(e)=>setValue({...value, new_password:e.target.value})} type="text" className="p-1 text-sm w-full" placeholder='New password' style={{outline:'none'}}/>
            </div>
            <button disabled={value.is_loading} style={{background:theme_bg, color:'white'}} className='p-1 text-sm w-full rounded mt-2'>{value.is_loading?'Changing...':'Change'}</button>
        </form>
    </div>
  );
}
