"use client";

import { useDataContext } from "@/context/DataProvider";
export default function LoginAdmins() {
  const {theme_bg} = useDataContext()
  
  return (
    <div className={`flex justify-center items-center h-screen bg-slate-300 flex-col `}>
        <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Welcome to Sscar admins</h3> <br />
        <form action="" className='bg-white h-50 md:w-[50%] sm:w-[90%] md:py-5 py-2 rounded-md px-2'>
            <div className='my-2 px-2'>
               <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Login to your account</h3>
            </div>
            <div className='my-2 border px-2'>
               <input type="text"className="p-1 text-sm" placeholder='Email' style={{outline:'none'}}/>
            </div>
            <div className='my-2 border px-2'>
               <input type="text" className="p-1 text-sm" placeholder='Password' style={{outline:'none'}}/>
            </div>
            <button style={{background:theme_bg, color:'white'}} className='p-1 text-sm w-full rounded'>Login</button>
        </form>
    </div>
  )
}
