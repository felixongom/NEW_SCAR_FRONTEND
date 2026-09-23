import { useDataContext } from '@/context/DataProvider';
import { numbersArray } from '@/utils';
import {brightness} from 'color-tin'
import { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
// 
function EnrolementSetTime() {
  const {dispatch, set_enrolement_time, theme_bg, selected_clas} = useDataContext()
  const [openYear, setOpenYear] = useState(false)
  //   
  const handleChange = (val)=>{
    let value = val    
    if(value<4){
        dispatch({type:"SET_ENROLEMENT_TIME", payload:{...set_enrolement_time, term:parseInt(value)}})
    }else{
      if(set_enrolement_time.exam.includes(value)){
        dispatch({type:"SET_ENROLEMENT_TIME", payload:{...set_enrolement_time, exam:set_enrolement_time.exam.filter(item => item !== value)}})
      }else{
        dispatch({type:"SET_ENROLEMENT_TIME", payload:{...set_enrolement_time, exam:[...set_enrolement_time.exam,value]}})
      }
    }
  }
  
  let year_list = numbersArray(10, set_enrolement_time.year-5).reverse() //[2025,2026,2027,2028,2029,2030 ]
  function openYearDialog(){
    setOpenYear(pre=>!pre)
  }
  // 
  function dispatchYear(year){
    setOpenYear(pre=>!pre)
    dispatch({type:"SET_ENROLEMENT_TIME", payload:{...set_enrolement_time, year:year}})
  }

  let exam_list = parseInt(+selected_clas.split(" ").pop()) >4? ['BOT', 'MOT','EOT']:['BOT', 'MOT','EOT','EOC', 'A1', 'A2', 'A3', 'A4', 'A5']
  
  return (
     <form className="flex flex-1 bg-white p-1 py-3 mt-2 flex-wrap justify-around text-sm">
        <div className="flex gap-1 h-1 pb-2">
          <label className='font-bold text-xs'>Year:</label>
          <div className="relativ">
            <div className='flex gap-3'>
              <span>{set_enrolement_time.year}</span>
                <span onClick={openYearDialog} className='font-semibold cursor-pointer'>
                  <IoIosArrowDown />
                </span>
            </div>
            {openYear && 
            <div className='flex flex-col absolute z-10'>
              {year_list.map(year=>(
                <span 
                key={year}
                style={{background:set_enrolement_time.year===year?theme_bg:'#e6e6e6',
                fontWeight:set_enrolement_time.year===year?'bold':'',
                color:`${set_enrolement_time.year===year?(brightness(theme_bg)<70?"white":'black'):'black'}`
             }}
                onClick={()=>dispatchYear(year)} 
                className='border border-blue-500" bg-white px-2 py-1 cursor-pointer'>{year}</span>
              ))}
        
            </div>
            }
          </div>
        </div>
        {/*  */}
        <div className="flex gap-1 text-sm pb-2">
          <label className='font-bold'>Term:</label>
          {[1,2,3].map(trm=>(
              <span onClick={()=>handleChange(trm)} 
              className='cursor-pointer ml-1 py-0 px-1 rounded' key={trm}
              style={{
                background:set_enrolement_time.term===trm?theme_bg:'#e6e6e6',
                fontWeight:set_enrolement_time.term===trm?'bold':'',
                color:`${set_enrolement_time.term===trm?(brightness(theme_bg)<70?"white":'black'):'black'}`
              }}
              >{trm}</span >
            ))}
        </div>
        {/*  */}
        <div className="flex gap-1">
          <label className='font-bold text-xs relative'>Exam:</label>
            {exam_list.map(exam=>(
              <span onClick={()=>handleChange(exam)} 
              className='cursor-pointer ml-1 py-0 px-1 rounded' key={exam}
              style={{
                height:19,
                background:set_enrolement_time.exam.includes(exam)?theme_bg:'#e6e6e6',
                fontWeight:set_enrolement_time.exam.includes(exam)?'bold':'',
                color:`${set_enrolement_time.exam.includes(exam)?(brightness(theme_bg)<70?"white":'black'):'black'}`
              }}
              >{exam}</span >
            ))}

        </div>

      </form>
  )
}

export default EnrolementSetTime