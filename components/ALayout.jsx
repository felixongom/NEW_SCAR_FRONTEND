'use client'

import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import SideMenu from "./Avance/SideMenu" 
import { useEffect, useState} from "react";
import { useDataContext } from "@/context/DataProvider";
import axios from "axios";
import { base_api_path } from "@/utils/reportList";
import AuthLayout from "./AuthLayout";
import { getToken } from "@/utils";
//  Register AG Grid community modules
export default function ALayout({children}){
  const {dispatch, selected_clas, set_time, a_level_subject } = useDataContext()
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    let clas = selected_clas?.split(' ')[1]
  
  useEffect(() => {
    async function fetchSchool(){
      const subject_response = await axios.get(`${base_api_path}subjecs`,{
        headers:{'Authorization':`Bearer ${getToken('access_token')}`}
      })      
      dispatch({type:'A_LEVEL_SUBJECT', payload:subject_response.data}) 
      //       
      const response = await axios.get(`${base_api_path}school-info`,{
        headers:{'Authorization':`Bearer ${getToken('access_token')}`}
      }); // Example API
      // 
      dispatch({type:'SCHOOL_INFO', payload:response.data?.info})       
      dispatch({type:'GRADE_RANGE', payload:{grade:response.data?.grade, subsidiary_grade:response.data?.subsidiary_grade}}) 
      dispatch({type:'GRADINGS', payload:response.data?.gradings}) 
      
      
    }
    fetchSchool()
  }, [selected_clas, set_time.year, set_time.term, set_time.exam])
  // 
   useEffect(()=>{
     
     const fetchData = async () => { 
        try {
         
          // fetch grade count of each subject
          const count_response = await axios.post(`${base_api_path}count-grade/clas/${clas}/year/${set_time.year}/term/${set_time.term}/exam/${set_time.exam}`, {
          payload:a_level_subject?.subject_group
      });
      dispatch({ type: 'GRADE_COUNT', payload: count_response.data })
      // 
      } catch (err) {
          console.log(error);
          setError(err)
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    },[selected_clas, set_time.year, set_time.term, set_time.exam])
      
return(
  <AuthLayout>
      <div className="w-full h-[100vh] flex print:p-0">
        <SideMenu />
        { children }
      </div>
  </AuthLayout>
)
}