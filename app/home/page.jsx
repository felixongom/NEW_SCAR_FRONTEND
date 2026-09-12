'use client'

import LogoPreviewer from "@/components/PageElement/LogoPreviewer"
import Download from "@/components/Download"
import ExcelUploader from "@/components/ExcelUploader"
import { useDataContext } from '@/context/DataProvider'
import { useEffect } from "react"
import AuthLayout from "@/components/AuthLayout"
import { useRouter } from "next/navigation"
import PageSchoolInfo from "@/components/PageSchoolInfo";
import { base_api_path } from "@/utils/reportList"

export default function ExcelToJsonBySheetName() {
  const {dispatch,main_school_info} = useDataContext();
  const router = useRouter()
   const paths = [
    '/data-files/ENROLEMENT.xlsm',
    '/data-files/S1__SDM DATA FILE.xlsm',
    '/data-files/S2__SDM DATA FILE.xlsm',
    '/data-files/S3__SDM DATA FILE.xlsm',
    '/data-files/S4__SDM DATA FILE.xlsm',
    '/data-files/ANALYZE_UCE.xlsx'];
  
  useEffect(()=>{
    let importantData = localStorage.getItem('importantData')
    let theme_bg = localStorage.getItem('theme_bg')
    if(theme_bg){
      dispatch({type:'THEME', payload:theme_bg})
     }
    if(!main_school_info) return router.push('/');
    if(!importantData) return router.push('/');
    if(!JSON.parse(importantData).token) return router.push('/');
  },[])
    // 
  
    
  return (
    <AuthLayout router={router}>
      <PageSchoolInfo dispatch={dispatch} main_school_info={main_school_info} />
      <div className="p-6 mx-auto flex-col" style={{display:'flex', justifyContent:"center", flexDirection:'column'}}>
        <LogoPreviewer />
        <ExcelUploader  level="O"/>
        <div className="pt-10">
          <Download base_api_path={base_api_path.replace('/api', '')} filePaths={paths} title="Student data files" />

        </div>
      </div>
    </AuthLayout>
  )
}
