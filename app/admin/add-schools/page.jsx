"use client";

import { useDataContext } from "@/context/DataProvider";
import { base_api_path } from "@/utils/reportList";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
export default function LoginAdmins() {
  // 
   const searchParams = useSearchParams();
   const id = searchParams.get('id');
   //
   const {theme_bg} = useDataContext()
   const [school, setSchool] = useState({
        name:'', 
        campus:'', 
        box_no:'',
        district_city:'',
        reg_email:'',
        is_sending:false,
        error:''
     })

     // 
   async function registerSchool(e){
      e.preventDefault()
      
      try {
         setSchool({...school, is_sending:true})
         if(id){
            await axios.patch(`${base_api_path}admin/user/${id}/edit`, {
              
            })
         }else{
            
            const {name, campus,box_no, district_city,reg_email} = school
            if(name.length>2 && box_no && district_city.length>2 && reg_email.includes('@')){
               try {
                  let res =await axios.post(`${base_api_path}school/register`, {
                     name, campus, box_no, district_city,reg_email,
                     is_admin:true
                  })
                  console.log(res.data)
                  
                  
               } catch (error) {
                  console.log('error',error);
                  
               }

            }
            
         }
         
          
      } catch (error) {
         console.log(error);
         
      }finally{
         setSchool({
        name:'', 
        campus:'', 
        box_no:'',
        district_city:'',
        reg_email:'',
        is_sending:false,
        error:''
         })    
      }   
   }
  
  return (
    <div className={`reltive flex justify-center items-center h-screen bg-slate-300 flex-col `}>
        <Link href={'/admin/schools'} style={{ background:theme_bg, color:'#fff'}} className="text-left absolute top-2 left-2 text-xs rounded-full px-1"> Back</Link>
        <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Welcome to Sscar admins</h3> <br />
        <form onSubmit={registerSchool} className='bg-white h-50 md:w-[50%] sm:w-[90%] md:py-5 py-2 rounded-md px-2'>
            <div className='my-2 px-2'>
               <h3 className='font-semibold text-sm text-center' style={{color:theme_bg}}>Register a school</h3>
            </div>
            <small className="text-gray-500">School Name</small>
            <div className='mb-2 border px-2'>
               <input type="text" value={school.name} onChange={(e)=>setSchool({...school, name:e.target.value})} className="p-1 text-sm w-full" style={{outline:'none'}}/>
            </div>
            {school.name && school.name.length<=2 && <p className="text-xs text-red-600">Must be more than {school.name.length} charactors</p>}

            <small className="text-gray-500">Campus</small>
            <div className='mb-2 border px-2'>
               <input type="text" value={school.campus} onChange={(e)=>setSchool({...school, campus:e.target.value})} className="p-1 text-sm w-full" style={{outline:'none'}}/>
            </div>
            {school.campus && school.campus.length<=2 && <p className="text-xs text-red-600">Must be more than {school.campus.length} charactors</p>}

            <small className="text-gray-500">Box number</small>
            <div className='mb-2 border px-2'>
               <input placeholder="ed: P O Box 111" value={school.box_no} onChange={(e)=>setSchool({...school, box_no:e.target.value})} type="text"className="p-1 text-sm w-full" style={{outline:'none'}}/>
            </div>
            <small className="text-gray-500">District / City</small>
            <div className='mb-2 border px-2'>
               <input type="text" value={school.district_city} onChange={(e)=>setSchool({...school, district_city:e.target.value})} className="p-1 text-sm w-full" style={{outline:'none'}}/>
            </div>
            {school.district_city && school.district_city.length<=2 && <p className="text-xs text-red-600">Must be more than {school.district_city.length} charactors</p>}
            <small className="text-gray-500">Registration Email</small>
            <div className='mb-2 border px-2'>
               <input type="text" value={school.reg_email} onChange={(e)=>setSchool({...school, reg_email:e.target.value})} className="p-1 text-sm w-full" style={{outline:'none'}}/>
            </div>
            {school.reg_email && !school.reg_email.includes("@") && <p className="text-xs text-red-600">Must be a valid email</p>}
            <button style={{background:theme_bg, color:'white'}} className='p-1 text-sm w-full rounded'>Add School</button>
        </form>
    </div>
  )
}
