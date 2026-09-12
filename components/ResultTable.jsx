import { useEffect, useState } from 'react';
import {paginate, generateNumbersFrom, roundOff, rowColor} from '@/utils/index'
import { useDataContext } from '@/context/DataProvider';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {useStudentSearch} from "@/hooks/useStudentSearch"
import PaperOrientation, { ResultToReport } from "@/components/PaperOrientation"
import { MdOutlineLocalPrintshop } from "react-icons/md";
import {brightness} from "color-tin"
// 
export default function StudentTable({table_heading, setShowPopUp}) {
    // 
    const {transformed_data,data_chunk,theme_bg,dispatch} = useDataContext()
    const [query, setQuery] = useState('')
    const search_results = useStudentSearch(transformed_data, query, 300)
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(searchParams);
    // 
    let default_perpage = 60
    const page = searchParams.get('page') || 1
    let perpage = searchParams.get('perpage')|| default_perpage

    let d = transformed_data?paginate(transformed_data, {perpage:perpage || default_perpage, page}):null
    // 
    const handleParamChange = (newValue) => {
        currentParams.set('page', newValue);
        router.push(`${pathname}?${currentParams.toString()}`);
    };
    const handlePerPageChange = (newValue) => {
        currentParams.set('perpage', newValue);
        router.push(`${pathname}?${currentParams.toString()}`);
    };
    // 
    useEffect(()=>{
        dispatch({type:'DATA_CHUNK', payload: d?.data}) 
        if(search_results.length>0){          
          dispatch({type:'DATA_CHUNK', payload:search_results}) 
        }
    },[page, perpage, query])
    
    const handlePrintOneReport = (student)=>{
      setShowPopUp(prev=>!prev)
      dispatch({type:'DATA_CHUNK', payload:student})
    }
    
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 style={{color:`${theme_bg}`}} className="text-l font-semibold uppercase">{table_heading}<span className='text-xs font-bold bg-slate-300 text-green-700 p-1 rounded-xl'>{transformed_data?.length}</span></h2>
        <div className='flex-1 ml-2'>
            <div className='flex w-full flex-row justify-evenly'>
              <PaperOrientation/>
              <ResultToReport/>
                <div>
                  <span className='text-gray-600 text-sm'>Adjust Page</span>
                  <select
                      value={perpage}
                      onChange={e => handlePerPageChange(e.target.value)}
                      className="ml-1 max-w-xs px-2 w-[70px] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                      >
                      {[default_perpage,10, 20, 40,80, 100, transformed_data?.length].map((opt, index) => (
                        <option key={index} value={opt}>
                          {opt}
                        </option>
                      ))}
                  </select>
                </div>
                <input onChange={(e) => setQuery(e.target.value)} className='px-2 focus:border-0 text-sm' type="text" placeholder='Search student' />
            </div>
        </div>
        {data_chunk && (
            <div className='flex gap-2'>
                <button 
                style={{backgroundColor:`${theme_bg}`, color:brightness(theme_bg)<65?"white":'black'}} 
                onClick={()=>setShowPopUp(prev=>!prev)}
                className="text-white p-1 rounded-md transition text-sm"
                >
                <MdOutlineLocalPrintshop />
                </button>
            </div>
        )}
      </div>

      <table className="w-full border-collapse rounded-md overflow-hidden shadow-md">
        <thead style={{backgroundColor:`${theme_bg}`, color:brightness(theme_bg)<65?"white":'black'}} className={`text-white`}>
          <tr>
            <th className="p-1 text-left flex-1 text-sm">#</th>
            <th className="p-1 text-left flex-3 text-sm">Learner's Name</th>
            <th className={`p-1 text-left flex-1 text-sm`}>Stream</th>
            <th className="p-1 text-left flex-1 text-sm">Gender</th>
            <th className="p-1 text-center flex-1 text-sm">AVG Score</th>
            <th className="p-1 text-center flex-1 text-sm">AVG Grade</th>
            <th className="p-1 flex-1 text-left text-sm">Descriptor</th>
            <th className="p-1 text-center flex-1 text-sm">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {(!data_chunk || (data_chunk && data_chunk.length===0))?(<tr className='flex justify-center'><td>No Student in {table_heading}</td></tr>): data_chunk?.map((student, index) => (
            <tr
              key={index}
              className={`border-t hover:bg-gray-100 transition duration-800 ${rowColor(student['AVG'])}`}
            >
              <td className="p-1 flex-2 text-sm flex-1 capitalize">{(parseInt(page)-1)* parseInt(perpage || 10) + index + 1}</td>
              <td className="p-1 flex-2 text-sm flex-1">{student['STUDENT NAME']}</td>
              <td className={`p-1 text-left'} text-sm flex-1 capitalize`}>{student['STREAM']}</td>
              <td className="p-1 text-sm flex-1 capitalize">{student['SEX']}</td>
              <td className="p-1 text-center text-sm flex-1 uppercase" >{ roundOff(student['AVG']) }</td>
              <td className="p-1 text-center text-sm flex-1">{student['AVG GRADE']}</td>
              <td className="p-1 text-sm flex-1 capitalize"> {student['COMM']}</td>
              
              <td className="p-1 flex flex-row gap-2 flex-1 justify-center">
                <button
                    style={{backgroundColor:`${theme_bg}`}}
                    onClick={()=>handlePrintOneReport([student])}
                    className="bg-gray-800 text-white p-1 rounded-md hover:bg-gray-900 transition text-sm">
                    <MdOutlineLocalPrintshop />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
    </table>
    <div className='relative my-1 border-gray-400 justify-end' style={{with:'100%'}}>
        <div className=' absolute right-0 flex gap-1'>
            {generateNumbersFrom(d?.num_pages, 1).map(_page=>(
                <span 
                style={{background:_page==page?theme_bg:'', color:brightness(theme_bg)<65?'white':'black'}}
                key={_page} 
                onClick={()=>handleParamChange(_page)} 
                className={`py-2 px-3 rounded-full ${_page==page?'bg-gray-800 text-gray text-white font-bold':'text-gray-800 bg-slate-300'} text-xs cursor-pointer`}>{_page}</span>
            ))}
        </div>
    </div>
</div>
  );
}
