import { useDataContext } from '@/context/DataProvider';
import { numbersArray } from '@/utils';
import {brightness} from 'color-tin'
import { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
// 
function SetTime() {
  const {dispatch, set_time, theme_bg} = useDataContext()
  const [openMergedExam, setOpenMergedExam] = useState(false)
  const [openYear, setOpenYear] = useState(false)
  //   
  const handleChange = (val)=>{
    let value = val    
    if(value<4){
      dispatch({type:"SET_TIME", payload:{...set_time, term:parseInt(value)}})
    }else{
      dispatch({type:"SET_TIME", payload:{...set_time, exam:value}})
      if(!(value=='EOC' || value=="AOI")){
        dispatch({type:"RESERVE_EXAM", payload:value})
      }
    }
  }
  
  let year_list = numbersArray(8, set_time.year-5).reverse() //[2025,2026,2027,2028,2029,2030 ]
  function openYearDialog(){
    setOpenYear(pre=>!pre)
  }
  function dispatchYear(year){
    setOpenYear(pre=>!pre)
    dispatch({type:"SET_TIME", payload:{...set_time, year:year}})
  }
  let exam_types =['BOT & MOT','BOT & EOT', 'MOT & EOT', 'BOT & MOT & EOT']
  // const o_exam_types =['AOI', 'EOC', 'AOI & BOT', 'AOI & MOT', 'AOI & EOT','AOI & BOT & MOT', 'AOI & BOT & EOT', 'AOI & MOT & EOT','AOI & BOT & MOT & EOT']
  // if(parseInt(selected_clas.split(' ')[1])<5){
  //   exam_types = [...exam_types]
  // }  

  return (
     <form className="flex flex-1 bg-white p-1 py-2 mt-1 flex-wrap justify-around print:hidden border border-b-gray-400">
        <div className="flex gap-1">
          <label className='font-bold text-xs'>Year:</label>
          <div className="relative">
            <div className='flex gap-3  text-xs md:text-sm'>
              <span>{set_time.year}</span>
                <span onClick={openYearDialog} className='font-semibold cursor-pointer'>
                  <IoIosArrowDown />
                </span>
            </div>
            {openYear && 
            <div className='flex flex-col absolute z-10  text-xs md:text-sm'>
              {year_list.map(year=>(
                <span 
                key={year}
                style={{background:set_time.year===year?theme_bg:'#e6e6e6',
                fontWeight:set_time.year===year?'bold':'',
                color:`${set_time.year===year?(brightness(theme_bg)<70?"white":'black'):'black'}`
             }}
                onClick={()=>dispatchYear(year)} 
                className='border bg-white px-2 py-1 cursor-pointer'>{year}</span>
              ))}
        
            </div>
            }
          </div>
        </div>
        {/*  */}
        <div className="flex gap-1 text-xs md:text-sm">
          <label className='font-bold'>Term:</label>
          {[1,2,3].map(trm=>(
              <span onClick={()=>handleChange(trm)} 
              className='cursor-pointer ml-1 py-0 px-1 rounded' key={trm}
              style={{
                background:set_time.term===trm?theme_bg:'#e6e6e6',
                fontWeight:set_time.term===trm?'bold':'',
                color:`${set_time.term===trm?(brightness(theme_bg)<70?"white":'black'):'black'}`
              }}
              >{trm}</span >
            ))}
        </div>
        {/*  */}
        <div className="flex gap-1">
          <label className='font-bold text-xs relative'>Exam:</label>
            {['BOT','MOT', 'EOT'].map(exam=>(
              <span onClick={()=>handleChange(exam)} 
              className='cursor-pointer ml-1 py-0 px-1 rounded text-xs' key={exam}
              style={{
                background:set_time.exam===exam?theme_bg:'#e6e6e6',
                fontWeight:set_time.exam===exam?'bold':'',
                color:`${set_time.exam===exam?(brightness(theme_bg)<70?"white":'black'):'black'}`
              }}
              >{exam}</span >
            ))}
            <span onClick={()=>setOpenMergedExam(prev=>!prev)} className='flex flex-col text-xs absolute right-4'>
             <div 
             style={{
                background:set_time.exam.includes('&')?theme_bg:'#e6e6e6',
                fontWeight:set_time.exam.includes('&')?'bold':'',
                color:`${set_time.exam.includes('&')?(brightness(theme_bg)<70?"white":'black'):'black'}`
              }}
             className='cursor-pointer ml-1 py-1 px-1 rounded'>{set_time.exam.includes('&')?set_time.exam:'---'}</div>
            
             {openMergedExam && 
              exam_types.map(exam=>(
                <div onClick={()=>handleChange(exam)} 
                className='cursor-pointer pl-1' key={exam}
                style={{
                  zIndex:5,
                  background:set_time.exam===exam?theme_bg:'#e6e6e6',
                  fontWeight:set_time.exam===exam?'bold':'',
                  color:`${set_time.exam===exam?(brightness(theme_bg)<70?"white":'black'):'black'}`
                }}>{exam}</div>
              ))}
            </span>
        </div>
      </form>
  )
}

export default SetTime