"use client";
import { base_api_path } from "@/utils/reportList"; 
import EnroledMarkSheet from "@/components/Avance/EnroledMarkSheet"
import OEnroledMarkSheet from "@/components/Avance/OEnroledMarkSheet"
import ALayout from "@/components/ALayout";
import { useEffect, useState } from "react";
import axios from "axios";
import SetTime from "@/components/Avance/SetTime";
import NavBar from "@/components/Avance/NavBar";
import { useDataContext } from "@/context/DataProvider";
import {brightness} from "color-tin"
import { subject_full_name } from "@/utils/reportList";
import Loading from "../enroled/loading";
import { usePathname, useRouter } from "next/navigation";
import { getToken } from "@/utils";


export default function Results() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false)
  const [deleteTudent, setDeleteStudent] = useState(null)
  const [updateStudent, setUpdateStudent] = useState(null)
  const [error, setError] = useState(null);
  const [selectedSubj,setselectedSubj] = useState({ids:'', subject:''})
  const {set_time, dispatch,main_school_info, selected_clas, theme_bg, a_level_subject} = useDataContext()
  let [subject, setSubjects] = useState(null)
  // 
  let clas = selected_clas.split(' ')[1]
   //auth
  const router = useRouter()
  const pathname = usePathname(); 
  useEffect(()=>{    
    if(main_school_info) return router.push(pathname);
    if(!main_school_info) return router.push('/');
  },[])
  //

  useEffect(()=>{
     const fetchData = async () => { 
      try {
        setLoading(true);
        const response = await axios.get(`${base_api_path}enrolement/clas/${clas}/year/${set_time.year}/term/${set_time.term}/exam/${set_time.exam}/subj/${selectedSubj.ids}`, {
          headers:{'Authorization':`Bearer ${getToken('access_token')}`}
        });
        setResults(response.data);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  },[clas, set_time.year, set_time.term,set_time.exam, selectedSubj?.ids, deleting])
  
  // fetch list of subject
  useEffect(()=>{
    async function fetchSubjects() {
      const response = await axios.get(`${base_api_path}subjecs`)
      setSubjects(response.data,)
    }
    fetchSubjects()
  },[])

  //
 
  const handleSelect = (group)=>{
    setselectedSubj(group)
  }
      
 const doDelete = async (cases)=>{
     let payload = {ids:deleteTudent, set_time};
    
     if(cases==='councel'){
      setDeleteStudent(null)
      setUpdateStudent(null)
      
    }else if(cases==='marks'){//deletes everything about the student
      try {
        setDeleting(true)
        await axios.post(`${base_api_path}delete-marks`,payload);
        
      } catch (err) {
        console.error(err);
      }finally{
        setDeleting(false)
        setDeleteStudent(null)
        setUpdateStudent(null)
       }
     }
   }
  //  
 const doUpdate = async (cases)=>{
   
   if(cases==='councel'){
     setDeleteStudent(null)
     setUpdateStudent(null)
     
    }else if(cases==='update'){//updade marks      
      try {
        setDeleting(true)
        await axios.post(`${base_api_path}update-marks`,{results:updateStudent});
        setUpdateStudent(null)
        } catch (err) {
          console.error(err);
        }finally{
          setDeleting(false)
          setUpdateStudent(null)
       }
     }
   }
  
  return (
    <> 
    {
      (deleteTudent || updateStudent) && (deleteTudent?.length>0 || updateStudent?.length>0) && 
        <>
          <div className="bg-black fixed opacity-50" style={{zIndex:5, height:'100vh', width:'100vw'}}/>
          <div className="bg-transparent fixed overflow-hidden" style={{zIndex:5, height:'100vh', width:'100vw', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10}}>
            {deleting && <div className="text-gray-100 font-semibold text-7xl">. . .</div>}
            <div className="flex gap-3 bg-white py-10 px-10 rounded-md">
              <button onClick={()=>doUpdate('update')}  className="bg-orange-700 hover:bg-orange-500 rounded-md transition text-gray-100 text-sm px-2 py-1"> Save</button>
              <button onClick={()=>doDelete('marks')}  className="bg-gray-100 text-rose-700 rounded-lg border-rose-700 border-1 text-sm py-1 px-3"> Delete marks</button>
              <button onClick={()=>doDelete('councel')}  className="bg-green-700-700 text-slate-800 rounded-md text-sm py-1 px-3 border-slate-800 border"> Councel</button>
            </div>
          </div>
        </>
      
    }
  
    <ALayout>
      <div className="ag-theme-quartz flex-1" style={{ height: 100, width: "100%" }}>
         <NavBar heading={'Results'}/>
         <SetTime/>
         {loading && <Loading/>}
         <h2 className="mt-3 font-bold ">Select A subject</h2>
         <div className="flex flex-wrap bg-white shadow-sm gap-3 my-4 p-3">

          {a_level_subject && a_level_subject?.subject_group?.map((group, i)=>(
           <div
           key={i}
           style={{
            background:`${selectedSubj.subject  === group?.subject? theme_bg: "#e6e6e6"}`,
            color:`${selectedSubj.subject  === group?.subject?(brightness(theme_bg)<60?"white":'#1a1a1a'):'#1a1a1a'}`,
            fontWeight:`${selectedSubj.subject  === group?.subject? "bold":'normal'}`,
           }} 
           onClick={()=>handleSelect(group)}
           className="p-1 px-2 rounded cursor-pointer">{subject_full_name[group?.subject] ||group?.subject }</div>
          ))}
          </div>
          <div className="px-2">
          {results && (clas>4? 
          <EnroledMarkSheet 
          enroled={results}
          dispatch={dispatch}
          setDeleteStudent={setDeleteStudent}
          setUpdateStudent={setUpdateStudent}
          />: 
          <OEnroledMarkSheet 
          enroled={results}
          dispatch={dispatch}
          setDeleteStudent={setDeleteStudent}
          setUpdateStudent={setUpdateStudent}
          />)} 
         </div>
      </div>
    </ALayout>
    </>
  );
}
