'use client'

import {countGradeOfAllSubjects, filterSubjects, getMySubjects, transformStudentData } from '@/utils/reshpe_data'
import { useState } from 'react'
import { useDataContext } from '@/context/DataProvider'
import { useRouter } from 'next/navigation'
import {countStudentsByStream, generateGradingRanges, getToken } from '@/utils'
import {brightness} from "color-tin"
import _ from "lodash"
import { subject_full_name,base_api_path } from '@/utils/reportList'
import axios from 'axios'

export default function ExcelUploader({level, year_of_entry=0}) {
  let { dispatch,main_school_info, selected_clas,theme_bg,dashhboard_on } = useDataContext()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const router = useRouter()

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    if (!selectedFile) return

    setUploading(true)
    setProgress(0)
    setError(null)
    
    const formData = new FormData()    
    formData.append('file', selectedFile)
    formData.append('year_of_entry', year_of_entry);
    // axios start
    try {
      let url
      if(selected_clas ==="UNEB UCE" || selected_clas==="UNEB UACE" ){
        url = `${base_api_path}upload-excel?sheet1=${selected_clas}&sheet2=SCHOOL INFO&allow_all=${dashhboard_on}`
      }else{
        url = `${base_api_path}upload-excel?sheet1=${selected_clas}&sheet2=GRADINGS&sheet3=SCHOOL INFO&allow_all=${dashhboard_on}`
      }
      
      const res = await axios.post(url, formData,{
        //sent authorisation header
        headers:{'Authorization':`Bearer ${getToken('access_token')}`},
        //tracking upload progress
        onUploadProgress:(progressEvent)=>{
          const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          setProgress(percentComplete)
        }
      })
      //       
      
      
      let result = res.data      
      if(selected_clas==='UNEB UCE'){
        let info = {
          ... result['SCHOOL_INFO'], 
            ['SCHOOL NAME']:main_school_info['SCHOOL NAME'], //change school name to logged in school name
            ['logo']:main_school_info.logo, //change school logo to logged in school logo
            ['DISTRICT/CITY']:main_school_info['DISTRICT/CITY'], //change school district to logged in school district
            ['LOCATION']:main_school_info.LOCATION, //change school location to logged in school location
            ['BOX NO']:main_school_info['BOX NO'], //change school box number to logged in school box number
            ['MOTO']:main_school_info['MOTO'] || result['SCHOOL_INFO'].MOTO, //change school motto to logged in school motto
            ['EMAIL']:main_school_info['EMAIL'], //change school email to logged in school email
            ['CAMPUS']:main_school_info['CAMPUS'] //change school CAMPUS to logged in school CAMPUS
          }
        dispatch({ type: 'SCHOOL_INFO', payload:info})
        dispatch({ type: 'UNEB_UCE', payload:res.data})
        router.push(`/uneb-uce?clas=${selected_clas}`)

      }else if (res.status === 200) {
        if(result === true){
          router.push(`/A/enrole-students`)
        }else{
        //              
        let info = {
          ... result['SCHOOL INFO'], 
            ['SCHOOL NAME']:main_school_info['SCHOOL NAME'], //change school name to logged in school name
            ['logo']:main_school_info.logo, //change school logo to logged in school logo
            ['DISTRICT/CITY']:main_school_info['DISTRICT/CITY'], //change school district to logged in school district
            ['LOCATION']:main_school_info.LOCATION, //change school location to logged in school location
            ['BOX NO']:main_school_info['BOX NO'], //change school box number to logged in school box number
            ['MOTO']:main_school_info['MOTO'], //change school motto to logged in school motto
            ['EMAIL']:main_school_info['EMAIL'], //change school email to logged in school email
            ['CAMPUS']:main_school_info['CAMPUS'] //change school CAMPUS to logged in school CAMPUS
        }  
              
          dispatch({ type: 'SCHOOL_INFO', payload:info})
          dispatch({ type: 'GRADINGS', payload: result['GRADINGS'] })
          dispatch({ type: 'RANKED_DATA', payload: result['CLAS'] })
          dispatch({
            type: 'TRANSFORMED_DATA',
            payload: _.orderBy(transformStudentData(result['CLAS']), ['STREAM', 'STUDENT NAME'], ['asc', 'asc']),
          })
          dispatch({ type: 'NUM_PER_STREAM', payload: countStudentsByStream(result['CLAS']), })
          dispatch({ type: 'GRADE_RANGE', payload: generateGradingRanges(result['GRADINGS']) })
          dispatch({ type: 'GRADE_COUNT', payload: countGradeOfAllSubjects(result['CLAS']) })
          dispatch({ type: 'MY_SUBJECTS', payload: getMySubjects(result['CLAS'][0]) })
          dispatch({ 
            type: 'MY_SUBJECTS_OBJECT', 
            payload: filterSubjects(subject_full_name, getMySubjects(result['CLAS'][0])) 
          })  
          router.push(`/one-class?clas=${selected_clas}`)
        }
        
      } else {
        setError('Upload failed with status ' + result.status)
      }
      setUploading(false)
    } catch (error) {
      setError('Failed to parse server response.')
    }
  }

  const classes = level == 'O'?
  ['DASHBOARD']:
  ['SENIOR 1', 'SENIOR 2', 'SENIOR 3', 'SENIOR 4','SENIOR 5', 'SENIOR 6']
  const clickClass = (clas)=>{
    if(clas==='DASHBOARD'){
      router.push(`/A/enrole-students`)
      dispatch({ type: 'DASHBOARD_ON', payload: true })

    }else if(clas==='UNEB UACE' || clas==='UNEB UACE'){
      dispatch({ type: 'SELECTED_CLAS', payload: clas })
      dispatch({ type: 'DASHBOARD_ON', payload: false })
    
    }else{
      dispatch({ type: 'SELECTED_CLAS', payload: clas })
      dispatch({ type: 'DASHBOARD_ON', payload: false })
    }
  }
   // 
  return (
    <div className="p-4 max-w-md mx-auto space-y-4 w-full">
      <h1 className="text-xl font-bold mb-4 text-center" style={{color:theme_bg}}>{level=='O'?'WELCOME OT SSCAR':'REGISTER NEW STUDENT'}</h1>
      
      <div className='flex justify-between w-full gap-1 flex-wrap'>
        {classes.map(clas => (
          <button
            style={{
              background:`${selected_clas === clas? theme_bg: "#f2f2f2"}`,
              color:`${selected_clas === clas?(brightness(theme_bg)<70?"white":'black'):'black'}`,
              fontWeight:`${selected_clas === clas? "bold":'normal'}`,
            }}
              
            key={clas}
            onClick={() => clickClass(clas)}
            className={`${clas==='DASHBOARD'?'w-full': 'w-[48%]'} font-semibold p-3 uppercase cursor-pointer mb-1 rounded text-center`}
          >
            {clas}
          </button>
        ))}
      </div>

      <div className='bg-gray-300 mt-10 pt-0.5' />

      {level!='O' && selected_clas && (
        <input
          type="file"
          accept=".xlsx,.xlsm, .xls"
          onChange={handleChange}
          className="block mt-6 bg-gray-200 hover:bg-gray-300 text-black text-sm p-2 rounded-full file:bg-gray-100 file:text-pink-700 file:px-2 file:border-1 file:rounded-full file:border-pink-700"
        />
      )}

      {uploading && (
        <div className="mt-2">
          <progress value={progress} max="100" className="w-full h-2"/>
          <p className={`text-sm text-gray-600 text-center mt-1`}>{progress}%</p>
        </div>
      )}

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </div>
  )
}
