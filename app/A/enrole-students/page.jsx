"use client";
import ALayout from "@/components/ALayout";
import { useDataContext } from "@/context/DataProvider";
import { useEffect, useState } from "react";
import NavBar from "@/components/Avance/NavBar";
import EnrolementSetTime from "@/components/Avance/EnrolementSetTime";
import { base_api_path } from "@/utils/reportList";
import axios from "axios";
import {brightness} from "color-tin"
import { getToken, numbersArray, removeSubjectsForAorOLevel } from "@/utils";
import { IoIosArrowDown } from "react-icons/io";
import  {colorTin} from 'color-tin'
import {StudentEnorolementComponent, StudentUpdateComponent} from "@/components/StudentUpdateComponent"
import toast from "react-hot-toast";
import { Ring } from "ldrs/react";
// DATA GRID
import { DataGrid } from "react-gridix";
import "react-gridix/style.css";
import { FaRegEdit } from "react-icons/fa";


export default function AoneClass() {
  const {dispatch, theme_bg, set_enrolement_time,selected_clas } = useDataContext()
    let [subjects, setSubjects] = useState(null)
    const [openYear, setOpenYear] = useState(false)
    const [year_of_entry, setYearOfEntry] = useState(new Date().getFullYear())
    const [students, setStudents] = useState([])
    const [selected_Student, setSelectedStudent] = useState([])
    const [set_student_loading, setStudentLoading] = useState(true)
    const [enroling, setEnrolling] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [activate_delete, setActivateDelete] = useState(false)
    const [show_student_popup, setShowStudentPopup] = useState(null);
    const [coppy_enrolement_popup, setShowEnrolemetPopup] = useState(false)
    const [updating, setUpdating] = useState(false)
    //variables 
      
    let paper_bg = brightness(theme_bg)<60?theme_bg:"#1a1a1a"
    let paper_color = brightness(theme_bg)<60?'#1a1a00':"white"
    let years_list = numbersArray(10, year_of_entry-5).reverse() //[2025,2026,2027,2028,2029,2030 ]

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
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    setStudentLoading(false)
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
    setStudentLoading(true)
  }
  // function to enrole student
  const enroleStudent = async ()=>{
    if(!selected_Student.length) return
    if(!set_enrolement_time.exam.length) return toast.error(`FAILED, NO EXAM SELECTED`,{style: {border: '1px solid #e60000', background:'#ffe6e6', color:'#e60000'}})
    if(!set_enrolement_time.paper_id.length) return toast.error(`FAILED, NO PAPER SELECTED`,{style: {border: '1px solid #e60000', background:'#ffe6e6', color:'#e60000'}})
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
      toast.success(`DONE`)
      setEnrolling((prev) => !prev);
      setSelectedStudent([])
      dispatch({type:"SET_ENROLEMENT_TIME", payload:{...set_enrolement_time, paper_id:[]}})
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
    } catch (error) {
      console.log(error);
      toast.error(`Deleting ${selected_Student.length} Student Faild`)
    }finally{
      setActivateDelete(false)
      setDeleting(false)
    }
  }

  // 
  let colors = colorTin(theme_bg, 10)
   const entry_clas = parseInt(selected_clas.split(' ')[1])>4?'5':'1'
  let list_of_subjects = removeSubjectsForAorOLevel(subjects?.swapped_subjects || {}, entry_clas)  

  const toggleStudent = (id) => {
    if(id===true){
      let ids = students.map(student=>student.id)

      if(selected_Student.length){
        setSelectedStudent([])
      }else{
        setSelectedStudent(ids)
      }
    }else{
      setSelectedStudent((prev) =>prev.includes(id)? prev.filter((x) => x !== id): [...prev, id]);
    }
  }
  // DATA GRID
  function linkRenderer({row}){
    return(
      <button className="h-[25px] w-[25px] bg-gray-200 rounded-md flex justify-center items-center text-center hover:bg-gray-700 text-yellow-500 hover:text-white">
        <FaRegEdit onClick={()=>setShowStudentPopup(row)} className="cursor-pointer"/> 
      </button>
    )
  }
  function checkBoxRenderer({value,row}){
    return(
      <button
        style={{borderColor:selected_Student.length?theme_bg:'#999'}}
          onClick={() => toggleStudent(value)}
          className={`flex h-4 w-4  items-center justify-center border transition
          ${selected_Student.includes(row.id)? "border-green-600": "border-gray-500"}`}>
          {selected_Student.includes(row.id) ? <span className="h-2 w-2 rounded-sm" style={{backgroundColor:theme_bg}}/>:null}
      </button>
    )
  }
  function headerCheckBoxRenrer(){
    return(
      <button
        style={{borderColor:selected_Student.length?theme_bg:'#999'}}
          onClick={() => toggleStudent(true)}
          className={`flex h-4 w-4  items-center justify-center border transition
          ${selected_Student.length? "border-green-600": "border-gray-500"}`}>
          {selected_Student.length ? <span className="h-2 w-2 rounded-sm" style={{backgroundColor:theme_bg}}/>:null}
      </button>
    )
  }
  function toolBarOptions(){
    return(
      <div >
        <button 
          disabled={enroling?true:false}
          onClick={()=>setShowEnrolemetPopup(prev=>!prev)} 
          className='text-white px-3 py-1 rounded text-xs shadow-md'
          style={{backgroundColor:colors.darker_10}}
          >
          Copy Enrolment
        </button>
        <button disabled={enroling?true:false} onClick={()=>setActivateDelete(prev=>!prev)} className='bg-white border-2 border-red-600 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1 rounded text-xs shadow-md ml-1'>
          {deleting ? <Ring size={25} stroke={2} bgOpacity={0} speed={2} color="white"/>:'Delete'}
        </button>
        <button 
          disabled={enroling?true:false} 
          onClick={enroleStudent} className='bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded text-xs shadow-md ml-1'
          style={{backgroundColor:colors.theme_bg}}>
            {enroling ? <Ring size={25} stroke={2} bgOpacity={0} speed={2} color="white"/>:'Enrole'}
        </button>
       </div> 
    )
  }
 

    const columns = [
      
      { field: "id", headerName: "#",
        headerClassName:'font-semibold border-b-2 border-gray-400 text-sm',
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        width:"50px",overflow: "ellipsis", 
        type: "sequence",
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},  
      },
      { 
        field: "id", headerClassName:'border-b-2 border-gray-400 text-sm', 
        width:"5%",overflow: "ellipsis", type: "boolean text-sm",
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},
        cellRenderer:checkBoxRenderer, 
        headerRenderer:headerCheckBoxRenrer,
        headerCheckbox: true,
        type:'boolean'
      },
      { 
        field: "learner_id", headerName: "STUDENT NO.",
        width: "12%",
        align: "left", 
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},
        overflow: "ellipsis",
        headerClassName:'border-b-2 border-gray-400 text-sm',
        editable:false 
      },
      { field: "STUDENT NAME",
        headerClassName:'border-b-2 border-gray-400 text-sm', 
        width:"20%",
        overflow: "ellipsis",
        headerClassName:'border-b-2 border-gray-400', 
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        // align: "center", 
        sortable:true,
        editable:false,
      },
      { field: "SEX", 
        headerName: "SEX",
        headerClassName:'border-b-2 border-gray-400 text-sm', width:'20',
        align: "center",
        width:"8%",
        headerClassName:'border-b-2 border-gray-400', 
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},
        overflow: "ellipsis",
        editable:false
      },
      { field: "STREAM", 
        headerName: "STREAM",
        headerClassName:'border-b-2 border-gray-400 text-sm', 
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},
        width:"10%",
        overflow: "ellipsis",
        sortable:true,
        align: "center",
        editable:false
      },
      { field: "learner_password", 
        headerName:'L PASSWORD',
        headerClassName:'border-b-2 border-gray-400 text-sm', 
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},
        width:"12%",
        overflow: "ellipsis",
        align: "center",
        editable:false
      },
      { field: "parent_password", 
        headerName:'P PASSWORD',
        headerClassName:'border-b-2 border-gray-400 text-sm', 
        width:"12%",
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},
        align: "center",
        overflow: "ellipsis",
        editable:false
      },
      { 
        field: "pay_code", 
        headerName: "PAY CODE",
        headerClassName:'border-b-2 border-gray-400 text-sm', 
        width:"10%",
        filterable:false, 
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},
        valueFormatter:(value)=>value||`-`,
        align: "center",
        overflow: "ellipsis", 
        editable:false
      },
      { 
        field: 'id', 
        headerName: "ACTION",
        headerClassName:'border-b-2 border-gray-400 text-sm', 
        width:"10%",
        headerStyle:{backgroundColor:'#fff', color:theme_bg},
        cellStyle:{borderBottom:`1px solid ${colors.lighter_70}`},
        cellRenderer:linkRenderer,
        align: "left", 
      },
    ];

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
      <div className={`flex-1 pl-1 ${(show_student_popup || coppy_enrolement_popup) && 'fixed'} `}>
        <NavBar heading="ENROLE STUDENTS"/>
        <EnrolementSetTime/>
        <hr />
        <div className="flex-1 bg-white p-2" style={{ height: 'auto', width: "100%" }}>
          <h2 className="mt-2 font-semibold text-sm md:text-l text-slate-800">Select Subject/Papers </h2>
          {!subjects?<Ring size={30} stroke={2} bgOpacity={0} speed={2} color={theme_bg}/>:
          
        <div className="flex flex-wrap shadow-sm gap-3 mb-4 py-2 text-sm text-slate-600">
          <button
            onClick={()=>dispatch({type:"SET_ENROLEMENT_TIME", payload:{...set_enrolement_time, paper_id:[]}})}
            className="bg-red-700 hover:bg-red-600 text-white p-0 px-2 rounded cursor-pointer text-thin text-sm md:text-sm">Reset
          </button>
          {subjects && Object.keys(list_of_subjects)?.map((paper, i)=>(
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
            <label className='font-bold '>Year of Entry to Senior {entry_clas}:</label>
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
        </div>
      <div className="w-full">
        <DataGrid
          columns={columns}
          rows={students}
          getRowId={(r) => r.id}
          editable
          // onRowsChange={setRows}
          // columnFilters={true}
          
          className="overflow-y-hidden shadow-none rounded-md"
          // styles={{root:{background:'magenta'}}}
          triped
          searchable
          searchPlaceholder="Seach students ..."
          toolbar={toolBarOptions()}
          // 
          pagination={false}
          showFooter={false}
          stickyToolbar
          stickyHeader
          loading={set_student_loading}
          loadingRows={5}
          
          stripeColors={['#fff', colors.lighter_90]}
          rowClassName={({id})=>selected_Student.includes(id)?'bg-green-200':null}
          classNames={{
            search: "rounded-md border-slate-300 px-1 py-1 focus:border-slate-800",
            row: "hover:bg-gray-200d border-bk border-slate-800k font-mono",
            footer: "bg-slate-800 text-slate-100",
            toolbar: "bg-slate-800s px-4 py-3",
            table:'min-w-[800px] md:min-w-full',
            cell: "py-2 h-full", // styling the cell
            pageButton: "rounded-fulll font-bold bg-white text-black hover:bg-red-600",
            
          }}
          />
      </div>    
        </div>
    </ALayout>
    </>
  );
}
