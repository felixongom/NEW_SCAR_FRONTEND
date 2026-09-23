"use client";
import ALayout from "@/components/ALayout";
import { colorTin } from "color-tin"
// import { usePathname, useRouter } from 'next/navigation'
import { useDataContext } from "@/context/DataProvider";
import { useEffect, useState } from "react";
import NavBar from "@/components/Avance/NavBar";
import axios from "axios";
import { getToken } from "@/utils";
import { base_api_path } from "@/utils/reportList";
import { Ring } from "ldrs/react";
import toast from 'react-hot-toast';


export default function AoneClass() {
  const {main_school_info, theme_bg, dispatch} = useDataContext()
  const [updating, setUpdating] = useState(false)
  const [school, setSchool] = useState({
    name:main_school_info?.['SCHOOL NAME'],
    moto:main_school_info?.['MOTO'],
    campus: main_school_info?.['CAMPUS'],
    box_no:main_school_info?.['BOX NO'],
    district:main_school_info?.['DISTRICT/CITY'],
    email:main_school_info?.['EMAIL'],
    phone:main_school_info?.['PHONE'],
    location:main_school_info?.['LOCATION']
  })
  //auth
  // const router = useRouter()
  // const pathname = usePathname(); 
  // useEffect(()=>{    
  //   if(main_school_info) return router.push(pathname);
  //   if(!main_school_info) return router.push('/');
  // },[])
  
  //update the school
  useEffect(()=>{    
    // fetch school 
    async function fetchAuthSchool(){
      const school_res = await axios.get(`${base_api_path}school/auth-school`, {
        headers:{
          'Authorization':`Bearer ${getToken('access_token')}`
          }
        })  
        // 
        if(school_res.data && updating){
           toast.success('Edited created!')
        }    
        dispatch({ type: 'MAIN_SCHOOL_INFO', payload: school_res.data?.school })
      } 
      fetchAuthSchool()               
  },[updating])

  async function updateSchool(e){
    e.preventDefault()
   
    let {name, moto, box_no,district,email, phone, location} = school
      if(!(name && moto && box_no && district && email && phone && location)) return
      
      // 
      try {
        setUpdating((prev) => !prev);
         await axios.patch(`${base_api_path}school/edit-school`,
          school,
          { headers: { Authorization: `Bearer ${getToken('access_token')}` } },
        );        

      setUpdating((prev) => !prev);
      } catch (error) {
        setUpdating((prev) => !prev);
        console.log(error);
      }

  }
      
  // In your App.js
  return (
    <ALayout>
      <div className="flex-1 pl-1">
        <NavBar heading="EDIT SCHOOL"/>
        <div className="pt-2 border-t border-gray-400 bg-white p-2 flex justify-center items-center flex-col">
          <form className="md:w-3/4 w-full shadow p-2">
            <h3 className="font-semibold text-center text-teal-700 mb-2"> EDIT - {main_school_info?.['SCHOOL NAME']} </h3>
            
            <div className="w-full flex py-2 flex-col">
              <label className="text-xs font-semibold pb-1 text-gray-400">Name</label>
              <input value={school.name} onChange={(e)=>setSchool({...school, name:e.target.value})} className="text-gray-700 py-2 px-1 border border-gray-300 focus:border-red-500 focus:outline-none" />
            </div>
            <div className="flex justify-between w-full gap-2">
              <div className="w-full flex py-2 flex-col">
                <label className="text-xs font-semibold pb-1 text-gray-400">Motto</label>
                <input value={school.moto}  onChange={(e)=>setSchool({...school,moto:e.target.value})}  className=" text-gray-700 py-2 px-1 border border-gray-300 focus:border-red-500 focus:outline-none" />
              </div>
              <div className="w-full flex py-2 flex-col">
                <label className="text-xs font-semibold pb-1 text-gray-400">Campus Name</label>
                <input value={school.campus}  onChange={(e)=>setSchool({...school, campus:e.target.value})}  className="text-gray-700 py-2 px-1 border border-gray-300 focus:border-red-500 focus:outline-none" />
              </div>
            </div>
            {/*  */}
            <div className="flex justify-between w-full gap-2">
              <div className="w-full flex py-2 flex-col">
                <label className="text-xs font-semibold pb-1 text-gray-400">Box No.</label>
                <input value={school.box_no} onChange={(e)=>setSchool({...school, box_no:e.target.value})} className="text-gray-700 py-2 px-1 border border-gray-300 focus:border-red-500 focus:outline-none" />
              </div>
              <div className="w-full flex py-2 flex-col">
                <label className="text-xs font-semibold pb-1 text-gray-400">District/City</label>
                <input value={school.district} onChange={(e)=>setSchool({...school, district:e.target.value})} className="text-gray-700 py-2 px-1 border border-gray-300 focus:border-red-500 focus:outline-none" />
              </div>
            </div>
            {/*  */}
            <div className="flex justify-between w-full gap-2">
              <div className="w-full flex py-2 flex-col">
                <label className="text-xs font-semibold pb-1 text-gray-400">Email</label>
                <input value={school.email} onChange={(e)=>setSchool({...school, email:e.target.value})} className="text-gray-700 py-2 px-1 border border-gray-300 focus:border-red-500 focus:outline-none" />
              </div>
              <div className="w-full flex py-2 flex-col">
                <label className="text-xs font-semibold pb-1 text-gray-400">Phone</label>
                <input value={school.phone} onChange={(e)=>setSchool({...school, phone:e.target.value})} className="text-gray-700 py-2 px-1 border border-gray-300 focus:border-red-500 focus:outline-none" />
              </div>
            </div>
            <div className="w-full flex py-2 flex-col">
              <label className="text-xs font-semibold pb-1 text-gray-400">Location</label>
              <textarea rows={3} value={school.location} onChange={(e)=>setSchool({...school, location:e.target.value})} className="text-gray-700 py-2 px-1 border border-gray-300 focus:border-red-500 focus:outline-none" >
              </textarea>
            </div>
           
            <div onClick={updateSchool} className="w-full mx-auto mt-2 rounded flex justify-center" style={{backgroundColor:theme_bg}}>
              {updating?<Ring size={30} stroke={5} bgOpacity={0} speed={2} color="white"/>:
              <button className="bg-transparent w-full h-full text-white py-2">Save</button>
              }
            </div>
            
          </form>
        </div>
      </div>
    </ALayout>
  );
}
