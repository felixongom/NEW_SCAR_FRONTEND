"use client";
import { base_api_path, a_level_report_list } from "@/utils/reportList"; 
import ALayout from "@/components/ALayout";
import NavBar from "@/components/Avance/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDataContext} from "@/context/DataProvider";
import { countStudentsByStream, getToken } from "@/utils";
import Loading from "./loading";
import { usePathname, useRouter } from "next/navigation";
import SetTime from "@/components/Avance/SetTime";
import AResultTable from "@/components/AResultTable";
import OResultTable from "@/components/OResultTable";
import ReportCardLinks from '@/components/ReportListPopup'
import { ExportPaycodeComponet } from "@/components/StudentUpdateComponent";

export default function AoneClass() {
  const [deleting, setDeleting] = useState(false)
   const [show_delete_popup, setShowDeletingPopup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPopUp, setShowPopUp] = useState(false) 
  const [show_paycode_popup, setShowPaycodePopup] = useState(false) 
   const [is_uploading_paycode, setIsUploadingPayCode] = useState(false);
  

  const [selected_student, setSelectedStudent] = useState([]);
  const {set_time,main_school_info, selected_clas, dispatch} = useDataContext()
  
  // 
  let clas = selected_clas?selected_clas?.split(' ')[1]:'5'
  //auth
  // const router = useRouter()
  // const pathname = usePathname(); 

  // useEffect(()=>{        
  //   if(main_school_info) return router.push(pathname);
  //   if(!main_school_info) return router.push('/');
  // },[])

  //
  useEffect(()=>{ 
      
    const fetchData = async () => {   
      dispatch({type:'NUM_PER_STREAM', payload:''})
      dispatch({type: 'DATA_CHUNK',payload: ''}) 
      dispatch({type: 'TRANSFORMED_DATA',payload: ''}) 
      try {
        
          setLoading(true)        
          const response = await axios.get(`${base_api_path}enrolement/clas/${clas}/year/${set_time.year}/term/${set_time.term}/exam/${set_time.exam}`, {
            headers:{'Authorization':`Bearer ${getToken('access_token')}`}
          }); // Example API
          dispatch({type:'NUM_PER_STREAM', payload:countStudentsByStream(response?.data)})
          dispatch({
            type: 'TRANSFORMED_DATA',
            payload: _.orderBy(response?.data, ['STREAM', 'STUDENT NAME'], ['asc', 'asc']),
          })  
          // 
          setLoading(false)
        
      } catch (err) {
        console.log(err);
      }finally{
        setLoading(false)

      }
    };
    if(!(set_time.exam=='AOI' || set_time.exam=='EOC')){
      fetchData();
    }
  },[selected_clas, set_time.year, set_time.term, set_time.exam, deleting, is_uploading_paycode])
  //
  
  const doDelete = async (cases)=>{
    let payload = {ids:selected_student, set_time};
    
    if(cases === 'enrollement'){
      try {
      setDeleting(true)
      await axios.post(`${base_api_path}delete-student-marks`,payload);
      } catch (err) {
        console.error(err);
      }finally{
        setDeleting(false)
        setShowDeletingPopup(prev=>prev)
        setSelectedStudent([])
      }
    }
  }
  // let colors = colorTin(theme_bg, 10)    

  
  return (
    <>
    {loading && <Loading/>}
    {
      show_delete_popup && selected_student.length>0 && 
        <>
          <div className="bg-black absolute opacity-50" style={{zIndex:5, height:'100vh', width:'100vw'}}/>
          <div className="bg-transparent absolute overflow-hidden" style={{zIndex:5, height:'100vh', width:'100vw', display:'flex', alignItems:'center', justifyContent:'center', gap:10}}>
            <div className="bg-white p-5 rounded-md space-x-3">
              <button onClick={()=>doDelete('enrollement')}  className="bg-rose-700 text-white rounded-lg text-sm py-1 px-3"> Delete enrolement</button>
              <button onClick={()=>setShowDeletingPopup(prev=>!prev)}  className="bg-green-700-700 text-gray-800 rounded-lg text-sm py-1 px-3 border-rose-700 border-2"> Councel</button>
            </div>
          </div>
        </>
      
    }
  
    <ALayout>
        {showPopUp && (
          <div className='w-full h-[100vh] fixed z-10 bg-slate-600 backdrop-filter backdrop-blur-md bg-white/30'>
            <ReportCardLinks report_list={a_level_report_list} setShowPopUp={setShowPopUp}/>
          </div>
        )}
      {/* POPUP FOR PAYCODE STUDENT */}
          {show_paycode_popup &&
          <div className="absolute w-full h-full">
            <ExportPaycodeComponet
              setShowPaycodePopup={setShowPaycodePopup}
              selected_student={selected_student}
              setIsUploading={setIsUploadingPayCode}
              isUploading={is_uploading_paycode}
            />
          </div>} 
      <div className={`flex-1 ${!show_paycode_popup?'relative':'fixed'}`} style={{zIndex:1, height: 100, width: "100%" }}>
         <NavBar heading="ENROLED"/>
         <SetTime/>
         { parseInt(clas) <5 &&
          <OResultTable
            setShowPopUp={setShowPopUp}
            setSelectedStudent={setSelectedStudent}
            selected_student={selected_student}
            setShowDeletingPopup={setShowDeletingPopup}
            setShowPaycodePopup={setShowPaycodePopup}
            
            />} 

        { parseInt(clas) >= 5 &&
         <AResultTable 
            setShowPopUp={setShowPopUp}
            setSelectedStudent={setSelectedStudent}
            selected_student={selected_student}
            setShowDeletingPopup={setShowDeletingPopup}
            setShowPaycodePopup={setShowPaycodePopup}
          />}
        
      </div>
    </ALayout>
    </>
  );
}
