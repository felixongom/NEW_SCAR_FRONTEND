'use client'

import { useState } from 'react'
import { useDataContext } from '@/context/DataProvider'
import { useRouter } from 'next/navigation'
import {getToken } from '@/utils'
import {brightness} from "color-tin"
import {base_api_path } from '@/utils/reportList'
import axios from 'axios'

export default function ExcelUploader({level, year_of_entry=0}) {
  let { dispatch, selected_clas,theme_bg,dashhboard_on } = useDataContext()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  const router = useRouter()

  const handleChange = async (e) => {
    const selectedFile = e.target.files[0]
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
        dispatch({ type: 'UNEB_UCE', payload:res.data})
        router.push(`/A/uneb`)

      }else if (res.status === 200) {
        router.push(`/A/enrole-students`)
        
      } else {
        setError('Upload failed with status ' + result.status)
      }
      setUploading(false)
    } catch (error) {
      console.log(error);
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
