"use client";
import { a_subject_full_name, base_api_path } from "@/utils/reportList"; 
import EnroledMarkSheet from "@/components/Avance/EnroledMarkSheet"
import OEnroledMarkSheet from "@/components/Avance/OEnroledMarkSheet"
import ALayout from "@/components/ALayout";
import { useEffect, useState } from "react";
import axios from "axios";
import SetTime from "@/components/Avance/SetTime";
import NavBar from "@/components/Avance/NavBar";
import { useDataContext } from "@/context/DataProvider";
import {brightness} from "color-tin"
import Loading from "../enroled/loading";
import _ from 'lodash'
import { getToken, removeSubjectsForAorOLevel } from "@/utils";
import { getLearnerMarksIds } from "@/utils/reshpe_data";
import OExportToExcel from "@/hooks/useOExportMarks";
import AExportToExcel from "@/hooks/useAExportMarks";
import{ colorTin } from 'color-tin'


export default function Results() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false)
  const [deleteTudent, setDeleteStudent] = useState(null)
  const [updateStudent, setUpdateStudent] = useState(null)
  const[select_what_to_export, setSelectWhatToExport] = useState(false)
  const[select_what_to_delete, setSelectWhatToDelete] = useState(false)
  const [selectedSubj,setselectedSubj] = useState({ids:'', subject:''})
  // 
  const [selected_students,setSelectedSudents] = useState([])
  const [selected_exam_category,setSelectExamCategory] = useState([])
  const {set_time, dispatch, selected_clas, theme_bg, a_level_subject} = useDataContext()
  // 
  let clas = parseInt(selected_clas.split(' ')[1])
  

  useEffect(()=>{
     const fetchData = async () => { 
      try {
        setLoading(true);
        const response = await axios.get(`${base_api_path}enrolement/clas/${clas}/year/${set_time.year}/term/${set_time.term}/exam/${set_time.exam}/subj/${selectedSubj.ids}`, {
          headers:{'Authorization':`Bearer ${getToken('access_token')}`}
        });
        setResults(response.data);

      } catch (err) {
        console.log(err);
        
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  },[clas, set_time.year, set_time.term,set_time.exam, selectedSubj?.ids, deleting])
  // 

  const handleSelect = (group)=>{
    setselectedSubj(group)
    setSelectedSudents([])
    setSelectExamCategory([])
  }
  // 
  const selectStudents = (id)=>{
    
    if(id===true){
      
      if(selected_students.length){
        setSelectedSudents([]) 
      }else{
        let ids = enroled?.map(student=>student.learner_id)
        setSelectedSudents(ids) 
      }
      
    }else{
      let id_exists =  selected_students?.find(selected_id=>selected_id===id)
      if(!id_exists){
        setSelectedSudents(prev=>[...prev, id]) 
      }else{
        let new_ids = selected_students?.filter(selected_id=>selected_id!==id)
        setSelectedSudents(new_ids) 
      }
    }
  }
  
      
 const doDelete = async (cases)=>{
     let payload = {ids:deleteTudent, set_time};
    
     if(cases==='councel'){
      setDeleteStudent(null)
      setUpdateStudent(null)
      
    }else if(cases==='marks'){//deletes everything about the student
      try {
        setDeleting(true)
        await axios.post(`${base_api_path}delete-marks/${clas}`,payload);
        setSelectedSudents([])
        setSelectExamCategory([])
        
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
        await axios.post(`${base_api_path}update-marks/${clas}`,{results:updateStudent});
        setUpdateStudent(null)
        } catch (err) {
          console.error(err);
        }finally{
          setDeleting(false)
          setUpdateStudent(null)
       }
     }
   }
  
  const enroled = _.orderBy(results, ['stream', 'learner'], ['asc', 'asc']) 
  const one_student = enroled[0]
  let list_of_subjects = removeSubjectsForAorOLevel(a_level_subject?.subject_group ||[], parseInt(clas))
  // 
  const selectExamCateory = (exam_category)=>{
    if(exam_category===true){
      
      if(selected_exam_category.length){
        setSelectExamCategory([]) 
      }else{
        setSelectExamCategory([...Object.keys(one_student?.aoi_id || {}), ...Object.keys(one_student?.marks_id || {})]) 
      }
      
    }else{ 
      let exam_exists =  selected_exam_category?.includes(exam_category)
      if(!exam_exists){
        setSelectExamCategory(prev=>[...prev, exam_category])
      }else{
        let new_exams = selected_exam_category?.filter(exam_key=>exam_key!==exam_category)
        setSelectExamCategory(new_exams) 
      }
    } 
  }

    const prepareMarksIds = ()=>{
      setDeleteStudent(getLearnerMarksIds(enroled, selected_students, selected_exam_category))
      setSelectWhatToDelete(prev=>!prev)
    }

    let colors = colorTin(theme_bg, 10);
  
  return (
    <> 
    {
      (deleteTudent || updateStudent) && (deleteTudent?.length>0 || updateStudent?.length>0) && 
        <>
          <div className="bg-black fixed opacity-50" style={{zIndex:5, height:'100vh', width:'100vw'}}/>
          <div className="bg-transparent fixed overflow-hidden" style={{zIndex:5, height:'100vh', width:'100vw', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10}}>
            {deleting && <div className="text-gray-100 font-semibold text-7xl">. . .</div>}
            <div className="flex gap-3 bg-white py-10 px-10 rounded-md">
              <button onClick={()=>doUpdate('update')} className="bg-orange-700 hover:bg-orange-500 rounded-md transition text-gray-100 text-sm px-2 py-1"> Save</button>
              <button onClick={()=>doDelete('marks')} className="bg-gray-100 text-rose-700 rounded-lg border-rose-700 border-1 text-sm py-1 px-3"> Delete marks</button>
              <button onClick={()=>doDelete('councel')} className="bg-green-700-700 text-slate-800 rounded-md text-sm py-1 px-3 border-slate-800 border"> Councel</button>
            </div>
          </div>
        </>
    }
    
    <ALayout>
      <div className="ag-theme-quartz flex-1" style={{ height: 100, width: "100%" }}>
         <NavBar heading={'RESULTS'}/>
         <SetTime/>
         {loading && <Loading/>}
         <h2 className="mt-3 font-bold print:hidden">Select A subject</h2>
         <div className="flex flex-wrap bg-white shadow-sm gap-3 my-4 p-3 print:hidden">

          {list_of_subjects?.map((group, i)=>(
           <div
           key={i}
           style={{
            background:`${selectedSubj.subject  === group?.subject? theme_bg: "#e6e6e6"}`,
            color:`${selectedSubj.subject  === group?.subject?(brightness(theme_bg)<60?"white":'#1a1a1a'):'#1a1a1a'}`,
            fontWeight:`${selectedSubj.subject  === group?.subject? "bold":'normal'}`,
           }} 
           onClick={()=>handleSelect(group)}
           className="p-1 px-2 rounded cursor-pointer">{a_subject_full_name[group?.subject] ||group?.subject }</div>
          ))}
          </div>


          <div className="px-2">
          {results && (clas>4? 
          <EnroledMarkSheet 
          enroled={enroled}
          dispatch={dispatch}
          // setDeleteStudent={setDeleteStudent}
          setUpdateStudent={setUpdateStudent}
          setSelectWhatToExport={setSelectWhatToExport}
          setSelectWhatToDelete={setSelectWhatToDelete}
          subject_name ={selectedSubj?.subject}
          // 
          selectStudents={selectStudents}
          selected_students={selected_students} 
          />: 
          <OEnroledMarkSheet 
          enroled={enroled}
          dispatch={dispatch}
          subject_name ={selectedSubj?.subject}
          // setDeleteStudent={setDeleteStudent}
          setUpdateStudent={setUpdateStudent}
          setSelectWhatToExport={setSelectWhatToExport}
          setSelectWhatToDelete={setSelectWhatToDelete}
          // 
          selectStudents={selectStudents}
          selected_students={selected_students}
          />)} 
         </div>
      </div>
      {select_what_to_export && 
      <div className="w-full h-full overflow-hidden z-10 fixed">
        <div className="w-full h-full fixed overflow-hidden bg-slate-800 opacity-80"/>
        <div className="w-full flex mt-1 justify-center overflow-hidden">
          <div className="bg-gray-100 overflow-hidden rounded-lg opacity-100 w-[90%] md:w-[50%] relative">
            <h1 className="py-3 w-full text-white p-1 md:px-4" style={{background:colors.darker_40}}>SELLECT EXAM AND EXPORT</h1>
            <button onClick={()=>setSelectWhatToExport(prev=>!prev)} className="flex justify-center items-center px-2 rounded-full bg-slate-400 border hover:bg-red-600 text-white absolute top-3 right-3 text-sm">x</button>
            <div className="p-2 md:p-4">
              <div onClick={() => selectExamCateory(true)} style={{background:selected_exam_category.length?colors.lighter_70:'#fff'}}  className="flex gap-4 items-center border-b border-slate-100 px-2 py-4 bg-white rounded-md cursor-pointer text-slate-800 mb-5 shadow">
                <button
                  style={{
                    borderColor: selected_exam_category.length ? theme_bg : "#999",
                    }}
                    className={`flex h-4 w-4  items-center justify-center border transition bg-white rounded-full`}>
                     {selected_exam_category.length ? (
                      <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: theme_bg }}
                    />
                    ) : null}
                </button>
                  ALL
              </div>
              {Object.keys({...one_student?.aoi_id} || {}).map((aoi_key, i)=>{
                return(
                  <div key={'aoi'+i} onClick={() => selectExamCateory(aoi_key)} style={{background:selected_exam_category.includes(aoi_key) ?colors.lighter_70:'#fff'}}  className="flex gap-4 items-center border-b border-slate-100 px-2 py-4 bg-white rounded-md cursor-pointer text-slate-800 mb-5 shadow">
                    <button
                      style={{
                        borderColor: selected_exam_category.includes(aoi_key) ? theme_bg : "#999",
                      }}
                      className={`flex h-4 w-4  items-center justify-center border transition bg-white rounded-full`}
                      >
                      {selected_exam_category.includes(aoi_key) ? (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: theme_bg }}
                        />
                      ) : null}
                      </button>
                        AOI {i+1}
                  </div>
                )
              })}
              {Object.keys({...one_student?.marks_id} || {}).map((marks_key, i)=>{
                
                return(
                  <div key={'exam'+i} onClick={() => selectExamCateory(marks_key)} style={{background:selected_exam_category.includes(marks_key) ?colors.lighter_70:'#fff'}} className="flex gap-4 items-center border-b border-slate-100 px-2 py-4 bg-white rounded-md cursor-pointer text-slate-800 mb-5 shadow">
                    <button
                      style={{
                        borderColor: selected_exam_category.includes(marks_key) ? theme_bg : "#999",
                      }}
                      className={`flex h-4 w-4  items-center justify-center border transition bg-white rounded-full`}
                      >
                      {selected_exam_category.includes(marks_key) ? (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: theme_bg }}
                        />
                      ) : null}
                      </button>
                      {one_student.papers['paper_'+(i + 1)]}
                  </div>
                )
              })}
            {clas>4?
            <AExportToExcel 
              data={enroled?.filter(learner=>selected_students.includes(learner.learner_id))} 
              theme_bg={theme_bg} 
              selected_exam_category={selected_exam_category}
            />
            :
            <OExportToExcel 
              data={enroled?.filter(learner=>selected_students.includes(learner.learner_id))} 
              theme_bg={theme_bg} 
              selected_exam_category={selected_exam_category}
            />
            }
            </div>

          </div>

        </div>
      </div>}

      {select_what_to_delete &&
      <div className="w-full h-full overflow-hidden z-10 fixed">
        <div className="w-full h-full fixed overflow-hidden bg-slate-800 opacity-80"/>
        <div className="w-full flex mt-1 justify-center overflow-hidden">
          <div className="bg-gray-100 overflow-hidden rounded-lg opacity-100 w-[90%] md:w-[50%] relative">
            <h1 className="py-3 w-full text-white p-1 md:px-4" style={{background:colors.darker_40}}>SELLECT EXAM AND DELETE</h1>
            <button onClick={()=>setSelectWhatToDelete(prev=>!prev)} className="flex justify-center items-center px-2 rounded-full bg-slate-400 border hover:bg-red-600 text-white absolute top-3 right-3 text-sm">x</button>
            <div className="p-2 md:p-4">
              <div onClick={() => selectExamCateory(true)}  style={{background:selected_exam_category.length?colors.lighter_70:'#fff'}} className="flex gap-4 items-center border-b border-slate-100 px-2 py-4 bg-white rounded-md cursor-pointer text-slate-800 mb-5 shadow">
                <button
                  style={{
                    borderColor: selected_exam_category.length ? theme_bg : "#999",
                    }}
                    className={`flex h-4 w-4  items-center justify-center border transition bg-white rounded-full`}
                    >
                     {selected_exam_category.length ? (
                      <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: theme_bg }}
                    />
                    ) : null}
                </button>
                  ALL
              </div>
              {Object.keys({...one_student?.aoi_id} || {}).map((aoi_key, i)=>{
                return(
                  <div key={'aoi'+i} onClick={() => selectExamCateory(aoi_key)} style={{background:selected_exam_category.includes(aoi_key) ?colors.lighter_70:'#fff'}} className="flex gap-4 items-center border-b border-slate-100 px-2 py-4 bg-white rounded-md cursor-pointer text-slate-800 mb-5 shadow">
                    <button
                      style={{
                        borderColor: selected_exam_category.includes(aoi_key) ? theme_bg : "#999",
                      }}
                        className={`flex h-4 w-4  items-center justify-center border transition bg-white rounded-full`}
                      >
                      {selected_exam_category.includes(aoi_key) ? (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: theme_bg }}
                        />
                      ) : null}
                      </button>
                        AOI{i+1}
                  </div>
                )
              })}
              {Object.keys({...one_student?.marks_id} || {}).map((marks_key, i)=>{
                return(
                  <div key={'exam'+i} onClick={() => selectExamCateory(marks_key)} style={{background:selected_exam_category.includes(marks_key) ?colors.lighter_70:'#fff'}} className="flex gap-4 items-center border-b border-slate-100 px-2 py-4 bg-white rounded-md cursor-pointer text-slate-800 mb-5 shadow">
                    <button
                      style={{
                        borderColor: selected_exam_category.includes(marks_key) ? theme_bg : "#999",
                      }}
                        className={`flex h-4 w-4  items-center justify-center border transition bg-white rounded-full`}
                      >
                      {selected_exam_category.includes(marks_key) ? (
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: theme_bg }}
                        />
                      ) : null}
                      </button>
                    {one_student.papers['paper_'+(i + 1)]}
                  </div>
                )
              })}
              <button onClick={prepareMarksIds} className="w-full py-2 rounded-md text-white mt-3" style={{background:theme_bg}}>DELETE MARKS</button>
            </div>

          </div>

        </div>
      </div>}
    </ALayout>
    </>
  );
}
