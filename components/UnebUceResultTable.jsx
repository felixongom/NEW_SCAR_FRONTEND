import React, { useState } from 'react';
import { useDataContext } from '@/context/DataProvider';
import {brightness} from "color-tin"
import PaperOrientation from "@/components/PaperOrientation"
import _ from "lodash"
import Link from 'next/link';
// 
export default function UnebUceResultTable({table_heading}) {
    // 
    const {uneb_uce,theme_bg,dispatch} = useDataContext()
    const [searchedStudent, setSearchedStudent] = useState(uneb_uce?.UNEB_UCE)
    const [selectedTab, setSelectedTab] = useState('Index No')
    // 
    const handleParamChange = (newValue) => {
        let filtered = _.filter(uneb_uce?.UNEB_UCE||[], item=> 
            item['STUDENT NAME']?.toLowerCase().includes(newValue.trim())||
            item['INDEX NO']?.toLowerCase().includes(newValue.trim())||
            item['SEX']?.toLowerCase() === newValue.trim()
        )
        setSearchedStudent(filtered)
    };

  let links =[
    {name:'General', path:'/sammury/uce'},
    {name:'Best & Worst', path:'/sammury/uce/best-worst-students'},
    {name:'Subject Rank', path:'/sammury/uce/count-grade'},
  ]
  let sort_data =[
    {name:'Index No', value:'INDEX NO'},
    {name:'Performance', value:'OBTAINED_WEIGHT'},
    {name:'Name', value:'STUDENT NAME'},
    {name:'Sex', value:'SEX'},
  ]
  function sortAndDispatch(data){
    let sorted = _.orderBy(uneb_uce?.UNEB_UCE, [data.value], [data.value==='OBTAINED_WEIGHT'?'desc':'asc'])    
    setSearchedStudent(sorted)
    setSelectedTab(data.name)

    dispatch({type:'SORT_UNEB_UCE_DATA',payload:sorted })
  }
  let colors = colorTin(theme_bg, 10)
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex gap-3 justify-between items-center mb-4">
        <h2 style={{color:`${theme_bg}`}} className="text-l font-semibold uppercase">{table_heading}<span className='text-xs font-bold bg-slate-300 text-green-700 p-1 rounded-xl'>{uneb_uce?.UNEB_UCE?.length}</span></h2>
        <PaperOrientation/>
        <div className='flex-1 ml-2'>
            <div className='flex w-full flex-row justify-evenly'>
                <input onChange={(e) => handleParamChange(e.target.value)} className='px-2 focus:border-0 text-sm' type="text" placeholder='Search student' />
            </div>
        </div>
        
        {uneb_uce && (
            <div className='text-gray-500 text-xs'>
                <h3 className='mb-2 font-bold'>Sort data</h3>
                <div className='flex gap-1'>
                  {sort_data.map(data=>(
                    <button key={data.name}  onClick={()=>sortAndDispatch(data)}
                    style={{
                      backgroundColor:selectedTab===data.name?theme_bg:"white", 
                      color:selectedTab===data.name?'white':theme_bg}} 
                    className="text-white px-1 rounded-md transition text-xs shadow-md"
                    >
                    {data.name}
                    </button>
                  ))}
                </div>
            </div>
        )}
        {uneb_uce && (
            <div className='text-gray-500 text-xs'>
                <h3 className='mb-2 font-bold'>Print Documents</h3>
                <div className='flex gap-1'>
                  {links.map(link=>(
                    <Link key={link.name} href={link.path}
                    style={{
                      backgroundColor:`${theme_bg}`, 
                      color:brightness(theme_bg)<65?"white":'black'}} 
                      className="text-white px-1 rounded-md transition text-xs"
                    >
                    {link.name}
                    </Link>
                  ))}
                </div>
            </div>
        )}
      </div>

      <table className="w-full border-collapse rounded-md overflow-hidden shadow-md">
        <thead style={{backgroundColor:`${theme_bg}`, color:brightness(theme_bg)<65?"white":'black'}} className={`text-white`}>
          <tr>
            <th className="p-1 text-left flex-1 text-sm">#</th>
            <th className="p-1 text-left flex-3 text-sm">INDEX NO</th>
            <th className="p-1 text-left flex-3 text-sm">LEARNER'S NAME</th>
            <th className="p-1 text-left text-sm">SEX</th>
            {uneb_uce?.SUBJECT_LIST?.map(subj=>(
                <th key={subj} className="p-1 text-left flex-1 text-sm">{subj}</th>
            ))}
            <th className="p-1 text-left flex-1 text-sm">PROJ</th>
            <th className="p-1 text-left flex-1 text-sm">RES</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {!searchedStudent?(<tr className='flex justify-center'><td>No Student in {table_heading}</td></tr>):
           searchedStudent.map((student, index) => (
            <tr
              key={index}
              className={`border-t hover:bg-gray-100 transition duration-800 font-normal`}
              style={{
                display: "flex",
                paddingTop: "3",
                flexDirection: "row",
                backgroundColor: i % 2 === 1 ?  colors.lighter_80  : "#fff",
                height:'19',
                fontSize:'8',
                borderColor:colors.lighter_70,
                 borderBottomWidth:1
              }}
            >
                <td className="p-1 flex-2 text-sm flex-1 capitalize">{index +1}</td>
                <td className="p-1 flex-2 text-sm flex-1">{student['INDEX NO']}</td>
                <td className="p-1 flex-2 text-sm flex-1">{student['STUDENT NAME']}</td>
                <td className="p-1 text-sm flex-1 text-left capitalize">{student['SEX']}</td>
                {uneb_uce?.SUBJECT_LIST?.map(subj=>(
                    <th key={subj} className="p-1 text-center flex-1 font-normal text-sm">{student?.SUBJECTS[subj]}</th>
                ))}
                <td className="p-1 text-sm flex-1 capitalize text-center">{student['PROJECT WORK']}</td>
                <td className="p-1 text-sm flex-1 capitalize text-center">{student['RESULT']}</td>
            </tr>
          ))}
        </tbody>
    </table>
</div>
  );
}
