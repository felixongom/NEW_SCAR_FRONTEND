"use client";

import { useDataContext } from "@/context/DataProvider";
import { base_api_path } from "@/utils/reportList";
import Link from "next/link";
import axios from "axios"
import { useState } from "react";
import { useSearchParams } from "next/navigation";
export default function AddAdmins() {
   // 
   const searchParams = useSearchParams();
   const id = searchParams.get('id');
   const username = searchParams.get('username');

   //
   const {theme_bg} = useDataContext()
   const [user, setUser] = useState({
      username:id?username:'', 
      email:'', 
      password:'',
      is_sending:false,
      error:''
   })

   // 
   async function register(e){
      e.preventDefault()
      
      try {
         setUser({...user, is_sending:true})
         if(id){await axios.patch(`${base_api_path}admin/user/${id}/edit`, {
               username:user.username,
               is_admin:true
            })
         }else{
            await axios.post(`${base_api_path}admin/register`, {
               username:user.username,
               email:user.email,
               password:user.password,
               is_admin:true
            })
         }
         setUser({...user, username:'', email:'', password:''})     
         
      } catch (error) {
         console.log(error);
         
      }finally{
         setUser({...user, is_sending:false})     
      }   
   }
  
  return (
    <div className={`flex justify-center items-center h-screen bg-slate-300 flex-col `}>
        <Link href={'/admin/admins'} style={{ background:theme_bg, color:'#fff'}} className="text-left absolute top-2 left-2 text-xs rounded-full px-1"> Back</Link>
        <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Welcome to Sscar admins</h3> <br />
        <form onSubmit={(e)=>register(e)} className='bg-white h-50 md:w-[50%] sm:w-[90%] md:py-5 py-2 rounded-md px-2'>
            <div className='my-2 px-2'>
               <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Register New User</h3>
            </div>
            {user.error && <p className="text-xs py-1 px-2 text-red-600 w-full bg-red-200 border border-red-600">{user.error}</p>}
            <div className='mt-2 border px-2'>
               <input value={user.username} onChange={(e)=>setUser({...user, username:e.target.value})} type="text" className="p-1 text-sm" placeholder='User name' style={{outline:'none'}}/>
            </div>
            {user.username && user.username.length<4 && <p className="text-xs text-red-600">Username must be more then {user.username.length} charactors</p>}
            {!id && 
            <>
               <div className='mt-2 border px-2'>
                  <input value={user.email} onChange={(e)=>setUser({...user, email:e.target.value})} type="text"className="p-1 text-sm" placeholder='Email' style={{outline:'none'}}/>
               </div>
               {user.email && !user.email.includes('@') && <p className="text-xs text-red-600">Email is invalid</p>}
               <div className='mt-2 border px-2'>
                  <input value={user.password} onChange={(e)=>setUser({...user, password:e.target.value})} type="text" className="p-1 text-sm" placeholder='Password' style={{outline:'none'}}/>
               </div>
               {user.password && user.password.length<5 && <p className="text-xs text-red-600">Password ust be meore then {user.password.length} charactors</p>}
            </>
            }
            {!id?
               <button disabled={user.is_sending} style={{background:theme_bg, color:'white'}} className='p-1 text-sm w-full rounded mt-2'>{user.is_sending?'Sending ':'Register'}</button>:
               <button disabled={user.is_sending} style={{background:theme_bg, color:'white'}} className='p-1 text-sm w-full rounded mt-2'>{user.is_sending?'Update... ':'Update'}</button>
            }
        </form>
      
    </div>
  )
}
