"use client";
import ALayout from "@/components/ALayout";
import AEnroleStudents from "@/components/AEnroleStudent"
// import { usePathname, useRouter } from 'next/navigation'
import { useDataContext } from "@/context/DataProvider";
import { useEffect, useState } from "react";
import NavBar from "@/components/Avance/NavBar";
import EnrolementSetTime from "@/components/Avance/EnrolementSetTime";
import { base_api_path } from "@/utils/reportList";
import axios from "axios";
import {brightness} from "color-tin"
import Loading from "../enroled/loading";
import { getToken, numbersArray } from "@/utils";
import { IoIosArrowDown } from "react-icons/io";
import  {colorTin} from 'color-tin'
import {StudentEnorolementComponent, StudentUpdateComponent} from "@/components/StudentUpdateComponent"
import toast from "react-hot-toast";
import { Ring } from "ldrs/react";

export default function AoneClass() {
  const {dispatch, theme_bg, set_enrolement_time,selected_clas } = useDataContext()
    let [subjects, setSubjects] = useState(null)
    const [openYear, setOpenYear] = useState(false)
    const [year_of_entry, setYearOfEntry] = useState(new Date().getFullYear())
    const [students, setStudents] = useState([])
    const [selected_Student, setSelectedStudent] = useState([])
    const [set_student_loading, setStudentLoading] = useState(false)
    const [enroling, setEnrolling] = useState(false)
    // const [deleting, setDeleting] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [activate_delete, setActivateDelete] = useState(false)
    const [show_student_popup, setShowStudentPopup] = useState(null);
    const [coppy_enrolement_popup, setShowEnrolemetPopup] = useState(false)
    const [updating, setUpdating] = useState(false)
    //variables 
      
    let paper_bg = brightness(theme_bg)<60?theme_bg:"#1a1a1a"
    let paper_color = brightness(theme_bg)<60?'#1a1a00':"white"
    let years_list = numbersArray(10, year_of_entry-5).reverse() //[2025,2026,2027,2028,2029,2030 ]
  
  //auth
  // const router = useRouter()
  // const pathname = usePathname(); 
  // // 
  // useEffect(()=>{    
  //   if(main_school_info) return router.push(pathname);
  //   if(!main_school_info) return router.push('/');
  // },[])

  // fetch list of subject
  useEffect(()=>{
    async function fetchSubjects() {
      try {
        const response = await axios.get(`${base_api_path}subjects`)
        setSubjects(response.data)
      } catch (error) {
        console.log(error);
      }
    }
    fetchSubjects()
  },[])

  //
  useEffect(()=>{ 
    const fetchData = async () => {   
      let level = parseInt(selected_clas.split(' ')[1])>4?'A':'O'
      try {
        setStudentLoading(true)        
        const response = await axios.get(`${base_api_path}students/entry-year/${year_of_entry}/${level}`, {
          headers:{'Authorization':`Bearer ${getToken('access_token')}`}
        }); // Example API
        setStudents(response.data)
        setStudentLoading(false)
        setShowStudentPopup(false)
      } catch (err) {
        console.log(err);
      }finally{
        setStudentLoading(false)
      }
    };
    fetchData();
  },[year_of_entry, selected_clas, deleting, updating])

  // 
  const handleSelect = (paper_id)=>{
    
    if(set_enrolement_time.paper_id.includes(paper_id)){
      //remove the paper_id
      dispatch({type:"SET_ENROLEMENT_TIME", payload:{...set_enrolement_time, paper_id:set_enrolement_time.paper_id.filter(item => item !== paper_id)}})
    }else{
      //add paper_id
      dispatch({type:"SET_ENROLEMENT_TIME", payload:{...set_enrolement_time, paper_id:[...set_enrolement_time.paper_id,paper_id]}})
    }
    
  }
  // 
  const changeYearOfEntry = (year)=>{
    setSelectedStudent([])
    setStudents([])
    setYearOfEntry(year)
    setOpenYear(pre=>!pre)
  }
  // function to enrole student
  const enroleStudent = async ()=>{
    try {
      let enrolemant_data = {
        ...set_enrolement_time, 
        learner_id:selected_Student,
        clas:parseFloat(selected_clas.split(' ')[1])
      }      
      // 
      setEnrolling((prev) => !prev);
      await axios.post( `${base_api_path}enrole-students`,enrolemant_data,
        {headers:{ Authorization: `Bearer ${getToken('access_token')}`}},
      );
      setEnrolling((prev) => !prev);
    } catch (error) {
      console.log(error);
      
    }
  }
  //deleting students from the database
  const deleteStudents = async()=>{
    try {  
      let ids = selected_Student          
      setDeleting((prev) => !prev);
      await axios.post( `${base_api_path}delete-students`,{ids},
        {headers:{ Authorization: `Bearer ${getToken('access_token')}`}},
      );
      toast.success(`Deleted ${selected_Student.length} Student`)
    } catch (_) {
      toast.error(`Deleting ${selected_Student.length} Student Faild`)
    }finally{
      setActivateDelete(false)
      setDeleting(false)
    }
  }

  // 
  let colors = colorTin(theme_bg, 10)

 
  // In your App.js
  return (
    <> 
    {
      (activate_delete) && (selected_Student?.length>0) && 
        <>
          <div className="bg-black fixed opacity-60" style={{zIndex:5, height:'100vh', width:'100vw'}}/>
          <div className="bg-transparent fixed overflow-hidden" style={{zIndex:5, height:'100vh', width:'100vw', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10}}>
            {deleting && <div className="text-gray-100 font-semibold text-xs">Deleting {selected_Student?.lenth}students...</div>}
            <div className="bg-white p-5 rounded-md space-x-3">
              <button onClick={deleteStudents}  className="bg-gray-100 text-rose-700 rounded-lg border-2 border-rose-700 border-1 text-sm py-1 px-3"> Delete marks</button>
              <button onClick={()=>setActivateDelete(prev=>!prev)}  className="bg-green-700-700 text-gray-800 rounded-lg text-sm py-1 px-3 border-gray-600 border-2"> Cancel</button>
            </div>
          </div>
        </>
    }
    {/* POPUP FOR UPDATING STUDENT */}
    {show_student_popup &&
    <div className="absolute w-full h-full">
      <StudentUpdateComponent
        setShowStudentPopup={setShowStudentPopup}
        student={show_student_popup}
        colors={colors}
        setUpdating={setUpdating}
        updating={updating}
      />
    </div>} 
    {/* POPUP FOR ENROLEMENT STUDENT */}
    {coppy_enrolement_popup &&
    <div className="absolute w-full h-full">
      <StudentEnorolementComponent
        setShowEnrolemetPopup={setShowEnrolemetPopup}
        coppy_enrolement_popup={coppy_enrolement_popup}
        colors={colors}
        enroling={setEnrolling}
        subjects={subjects?.swapped_subjects}
        // updating={updating}
      />
    </div>} 
    <ALayout>
      <div className={`flex-1 pl-1 ${(show_student_popup || coppy_enrolement_popup) && 'fixed'}`}>
        <NavBar heading="ENROLE STUDENTS"/>
        <EnrolementSetTime/>
        <hr />
        <div className="ag-theme-quartz flex-1 bg-white p-2" style={{ height: 'auto', width: "100%" }}>
          <h2 className="mt-2 font-semibold text-sm md:text-xl text-slate-800">Select Subject/Papers </h2>
          {!subjects?<Ring size={15} stroke={5} bgOpacity={0} speed={2} color="#262626"/>:
          
        <div className="flex flex-wrap shadow-sm gap-3 mb-4 py-2 text-sm text-slate-600">
          <button
            onClick={()=>dispatch({type:"SET_ENROLEMENT_TIME", payload:{...set_enrolement_time, paper_id:[]}})}
            className="bg-red-700 hover:bg-red-600 text-white p-0 px-2 rounded cursor-pointer text-thin text-sm md:text-sm">Reset
          </button>
          {subjects && Object.keys(subjects?.swapped_subjects)?.map((paper, i)=>(
            <button
              key={i}
              style={{
              background:set_enrolement_time.paper_id.includes(parseInt(subjects.swapped_subjects[paper]))?paper_bg:'#e6e6e6',
              color:set_enrolement_time.paper_id.includes(parseInt(subjects.swapped_subjects[paper]))?'#fff':paper_color,
              }} 
              onClick={()=>handleSelect(parseInt(subjects.swapped_subjects[paper]))}
              className="p-0 px-2 rounded cursor-pointer text-thin text-sm md:text-sm">{paper}</button>
              ))}
          </div>}
        </div>
        <div className="flex justify-between p-2 ">
          <div className="flex gap-1 pb-2 text-sm">
            <label className='font-bold '>Year of Entry:</label>
            <div className="relative">
              <div className='flex gap-3 font-bold' style={{color:theme_bg}}>
                <span>{year_of_entry}</span>
                  <span onClick={()=>setOpenYear(pre=>!pre)} className='font-semibold cursor-pointer'>
                    <IoIosArrowDown />
                  </span>
              </div>
              {openYear && 
              <div className='flex flex-col absolute z-10'>
                {years_list.map(year=>(
                  <span 
                  key={year}
                  style={{background:year_of_entry===year?theme_bg:'#e6e6e6',
                  fontWeight:year_of_entry===year?'bold':'',
                  color:`${year_of_entry===year?(brightness(theme_bg)<70?"white":'black'):'black'}`
              }}
                  onClick={()=>changeYearOfEntry(year)} 
                  className='border border-blue-500" bg-white px-2 py-1 cursor-pointer text-sm'>{year}</span>
                ))}
          
              </div>
              }
            </div>
          </div>  
          <div>

            <button 
              disabled={enroling?true:false}
              onClick={()=>setShowEnrolemetPopup(prev=>!prev)} 
              className='text-white px-3 rounded text-sm shadow-md'
              style={{backgroundColor:colors.darker_10}}
              >
              Copy Enrolment
            </button>
            <button disabled={enroling?true:false} onClick={()=>setActivateDelete(prev=>!prev)} className='bg-red-700 hover:bg-red-600 text-white px-3 rounded text-sm shadow-md ml-1'>
              {deleting ? <Ring size={25} stroke={2} bgOpacity={0} speed={2} color="white"/>:'Delete'}
            </button>
            <button 
              disabled={enroling?true:false} 
              onClick={enroleStudent} className='bg-cyan-700 hover:bg-cyan-600 text-white px-3 rounded text-sm shadow-md ml-1'
              style={{backgroundColor:colors.theme_bg}}
              >
              {enroling ? <Ring size={25} stroke={1} bgOpacity={0} speed={2} color="white"/>:'Enrole'}
            </button>

          </div>     
        </div>
        {set_student_loading? <Loading/>:
        <AEnroleStudents
          set_student_loading={set_student_loading}
          selected_student={selected_Student}
          students={students} 
          setSelectedStudent={setSelectedStudent}
          colors={colors}
          setShowStudentPopup={setShowStudentPopup}
        />}
        
      </div>
    </ALayout>
    </>
  );
}
