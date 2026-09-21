"use client";
import ALayout from "@/components/ALayout";
import ExcelUploader from "@/components/ExcelUploader";
import Download from "@/components/Download"
import { usePathname, useRouter } from 'next/navigation'
import { useDataContext } from "@/context/DataProvider";
import { useEffect, useState } from "react";
import NavBar from "@/components/Avance/NavBar";
import { getToken, numbersArray } from "@/utils";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { base_api_path } from "@/utils/reportList";
import "ldrs/react/Ring.css"
import {Ring} from "ldrs/react"
import toast from "react-hot-toast";
import {brightness} from "color-tin"

export default function AoneClass() {
  const {main_school_info,selected_clas, theme_bg} = useDataContext()
  const [student_data, setSudentData]=useState({name:'',stream:'',sex:null, pay_code:null})
  const[registering, setReistering] = useState()
  const [active_form, setActiveForm ] = useState('From Form')
  const [openYear, setOpenYear] = useState(false)
  const [year_of_entry, setYearOfEntry] = useState(new Date().getFullYear())
  const paths = [
    '/data-files/ENROLEMENT.xlsm',
    // '/data-files/S1__SDM DATA FILE.xlsm',
    '/data-files/ANALYZE_UCE.xlsx'];
  //auth
  const router = useRouter()
  const pathname = usePathname(); 
  useEffect(()=>{    
    if(main_school_info) return router.push(pathname);
    if(!main_school_info) return router.push('/');
  },[])

    // 
    let year_list = numbersArray(8, year_of_entry-5).reverse() //[2025,2026,2027,2028,2029,2030 ]
    function openYearDialog(){
      setOpenYear(pre=>!pre)
      
    }
    function changeYearOfEntry(year){
      setOpenYear(pre=>!pre)
      setYearOfEntry(year)

    }

    // 
    const registerStudent = async (e)=>{
      e.preventDefault()
      let {name, sex} = student_data
      if(!(name && sex)) return
      // 
      try {
        setReistering((prev) => !prev);
        let response = await axios.post(
          `${base_api_path}register-student`,
          {...student_data, year_of_entry, clas:selected_clas},
          { headers: { Authorization: `Bearer ${getToken('access_token')}` } },
        );
        
        setSudentData({name:'',stream:'',sex:'MALE', pay_code:null})
        setReistering((prev) => !prev);
        // 
        if(response.data){ 
          toast.success(`${student_data.name.toUpperCase()} Registered`)
        }else{
          toast.error(`${student_data.name.toUpperCase()} Not Registered`)
        }
      } catch (error) {
        setReistering((prev) => !prev);
        if(error){
          toast.error(`${student_data.name.toUpperCase()} Not Registered`)
        }
      }

    }
    
  // In your App.js
  return (
    <ALayout>
      <div className="flex-1 pl-1">
        <NavBar heading="REGISTER LEARNERS"/>
        <div className="flex justify-center gap-2 bg-white border-t border-t-slate-300 py-5">
          {['From Form', 'Upload file'].map(item=>(
            <button onClick={()=>setActiveForm(item)} className={`py-1 px-3 rounded-full border border-slate-900 shadow-sm text-sm transition-all duration-100 ${item===active_form?'bg-slate-700 font-semibold text-white':'white'}`}>{item}</button>
          ))}
        </div>
        <div className="w-full flex flex-col">
                <div className="flex gap-1 pb-2 text-sm">
                <label className='font-bold '>Year of Entry:</label>
                <div className="relative">
                  <div className='flex gap-3 font-bold' style={{color:theme_bg}}>
                    <span>{year_of_entry}</span>
                      <span onClick={()=>openYearDialog(pre=>!pre)} className='font-semibold cursor-pointer'>
                        <IoIosArrowDown />
                      </span>
                  </div>
                  {openYear && 
                  <div className='flex flex-col absolute z-10 border-b border-slate-100'>
                    {year_list.map(year=>(
                      <span 
                      style={{background:year_of_entry===year?theme_bg:'#e6e6e6',
                      fontWeight:year_of_entry===year?'bold':'',
                      color:`${year_of_entry===year?(brightness(theme_bg)<70?"white":'black'):'black'}`
                      }}
                      onClick={()=>changeYearOfEntry(year)} 
                      className='border-b border-blue-500" bg-white px-2 py-1 cursor-pointer text-sm'>{year}</span>
                    ))}
              
                  </div>}
              </div>
            </div> 
        </div>
        {active_form === 'From Form' && 
          <div className="border-t pt-2 border-slate-400 bg-white flex justify-center h-full">
            <form className="w-[90vw] md:w-1/2 rounded p-2 h-fit border border-slate-300">
              
               <h1 className="text-sm mdtext-xl font-bold mb-4 text-center" style={{color:theme_bg}}>REGISTER NEW STUDENT</h1>
              <div className="w-full flex py-2 flex-col">
                <label className="text-xs font-semibold pb-1 text-slate-400">Full Name</label>
                <input value={student_data.name} onChange={(e)=>setSudentData({...student_data,name:e.target.value})} className="text py-2 px-1 border border-slate-300 focus:border-blue-500 focus:outline-none" />
              </div>
              {/*  */}
              <div className="w-full py-2 flex flex-col">
                <label className="text-xs font-semibold pb-1 text-slate-400">Sex</label>
                <select value={student_data.sex} onChange={(e)=>setSudentData({...student_data,sex:e.target.value})} className="py-2 px-1 border border-slate-300 focus:border-blue-500 focus:outline-none text-xs">
                  {[null,'MALE', 'FEMALE'].map(sex=>(
                    <option className="text-xs" key={sex} value={sex}>{sex||'---'}</option>
                  ))}
                </select>
              </div>
                {/*  */}
              <div className="w-full py-2 flex flex-col">
                <label className="text-xs font-semibold pb-1 text-slate-400">Stream</label>
                <input value={student_data.stream} onChange={(e)=>setSudentData({...student_data,stream:e.target.value})} className="py-2 px-1  border border-slate-300 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="w-full py-2 flex flex-col">
                <label className="text-xs font-semibold pb-1 text-slate-400">Pay Code</label>
                <input value={student_data.pay_code} onChange={(e)=>setSudentData({...student_data,pay_code:e.target.value})} className="py-2 px-1  border border-slate-300 focus:border-blue-500 focus:outline-none" />
              </div>
              
              <div onClick={registerStudent} className="w-full mx-auto mt-2 rounded flex justify-center" style={{backgroundColor:theme_bg}}>
                {registering? 
                <Ring size={30} stroke={5} bgOpacity={0} speed={2} color="white"/>:
                <button className="bg-transparent w-full h-full text-white py-2">Save</button>
            }
              </div>
            </form>
          </div>
        }
        {active_form === 'Upload file' && 
        <div className="flex justify-center flex-col gap-2 bg-white border-t border-t-slate-300 py-1 h-full">
           <ExcelUploader year_of_entry={year_of_entry} level="A" />
            <Download base_api_path={base_api_path.replace('/api', '')} filePaths={paths} title="Student data files" />
        </div>}
        
      </div>
    </ALayout>
  );
}
