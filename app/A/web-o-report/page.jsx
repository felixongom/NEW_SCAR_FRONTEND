"use client";

import { useDataContext } from "@/context/DataProvider";

import WebReportLayout from "@/components/Report/WebReportLayout"
import MainWebReportLayout from "@/components/Report/MainWebReportLayout"
import { roundOff } from "@/utils";
import { paper_code, subject_full_name } from "@/utils/reportList";
import OReportSummary from "../../../components/OReportSummary";
import OReportGeneralSummary from "../../../components/OReportGeneralSummary";
import { useState } from "react";
import { ChangeExanAllAoiEoc } from "@/components/StudentUpdateComponent";

export default function AoneClass() {
  const {report_category,transformed_data,selected_clas, data_chunk, set_time, reserve_exam} = useDataContext()  
  const [title, setTile] = useState('')
  const [open_title, setOpenTitle] = useState(false)
  const clas = parseInt(selected_clas.split(' ')[1])
  // 
  let extra_data = {}
  let localStorageData = localStorage.getItem('importantData')
  if(localStorageData){
    let local_data = JSON.parse(localStorageData) 
    extra_data.begins = local_data?.begins
    extra_data.ends = local_data?.ends
    extra_data.put_position = local_data?.put_position
  }

  // In your App.js
  
  if(report_category=='report cards'){
    return ( 
      <>
        <MainWebReportLayout>
          <div className="flex space-x-5 border-t border-slate-300 py-2 justify-start items-center print:hidden">
            <button onClick={()=>setOpenTitle(prev=>!prev)} className="bg-slate-700 hover:bg-red-600 w-[100px] mb-2 top-1 right-1 rounded  text-white print:hidden">Edit Title</button>
            <ChangeExanAllAoiEoc/>
          </div>
          {data_chunk.length<=0?
            <div className="text-gray-400 text-3xl text-center">No card is available</div>
            :data_chunk?.map((student, i)=>{
              let _subject = student?.subjects
              
              return(
                <>

                <WebReportLayout 
                  key={i} student={student} 
                  class_count={transformed_data.length}
                  extra_data={extra_data}
                  title={title}
                  > 
                  {clas>4?

                  <table className='w-full'>
                        <tr className={`border border-black font-bold text-[15px]`}>
                            <td style={{width:'25%'}} className='border border-black p-1'>SUBJECT</td>
                            <td className='border border-black text-center p-1'>PAPER</td>
                            {reserve_exam.split('&')?.map((exm, exm_i)=>(
                              <td key={exm_i} className='border border-black flex-1 text-center'>{exm}</td>
                            ))}
                            <td className='border border-black text-center'>GRADE</td>
                            <td className='border border-black text-center'>AVG GRADE</td>
                            <td className='border border-black text-center'>GRADE</td>
                            <td style={{width:'20%'}} className='border border-black text-center'>ACHIEVEMENT LEVEL</td>
                        </tr>
                        {Object.keys(_subject)?.map((subject, i2)=>{
                          
                          return _subject[subject]?.subjects?.map((subj, i3)=>{                            
                            const name_array = subj.subject.split(' ');
                          
                            return(
                              <tr key={i3} className='border border-black  text-[15px]'>
                                  {
                                    i3===0 &&
                                  <>
                                    <td rowSpan={_subject[subject]?.subjects?.length} className={`border border-black p-1 text-[15px] py-${student?.num_subjects<9?'2':'1'}`}>{subject_full_name[subject]}</td>
                                  </>

                                  }
                                  <td className={`border border-black p-1 text-center text-[15px] py-${student?.num_subjects<9?'2':'1'}`}>{paper_code[name_array[0]]}/{name_array[1]}</td>
                                {/*  */}
                                {
                                  Object.keys(subj.EXAM_05)?.map((exm, exm_i)=>( 
                                    <td key={exm_i} className={`border border-black text-center text-[15px] py-${student?.num_subjects<10?'2':'1'}`}> {roundOff(subj.EXAM_05[exm.trim()], 2)||'-'} </td>
                                  ))
                                }
                                {/* {
                                  Object.keys(subj.EXAM_05)?.map((exm, exm_i)=>( 
                                    <td key={exm_i} className={`border border-black text-center text-[15px] py-${student?.num_subjects<10?'2':'1'}`}> {roundOff(subj.EXAM_GRADE[exm.trim()], 2)||'-'} </td>
                                  ))
                                } */}
                                {/*  */}
                                {i3===0 &&
                                  <>
                                    {/* <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black flex-1 text-center font-semibold'>{roundOff(_subject[subject]?.EXAM_AVERAGE_80,0)||'-'}</td> */}
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black flex-1 text-center font-semibold'>{roundOff(_subject[subject]?.TOTAL,2)||'-'}</td>
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black text-center'>{_subject[subject]?.GRADE || '-'}</td>
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className={`border border-black px-1 italic text-${_subject[subject]?.COMMENT?'left':'center'}`}>{_subject[subject]?.COMMENT || '-'}</td>
                                  </>
                                }
                              </tr>
                            )
                          })
                      })}
                    </table>

                  :set_time.exam==='AOI'?
                    <table className='w-full'>
                        <tr className='border border-black font-bold text-[15px]'>
                            <td style={{width:'25%'}} className='border border-black p-1'>SUBJECT</td>
                            <td className='border border-black text-center '> AOI(x/3)</td>
                            <td className='border border-black text-center '> AOI(x/20)</td>
                            <td className='border border-black flex-1 text-center'>AOI(x/100)</td>
                            <td className='border border-black text-center'>GRADE</td>
                            <td style={{width:'20%'}} className='border border-black text-center'>ACHIEVEMENT LEVEL</td>
                        </tr>
                        {Object.keys(_subject)?.map((subject, i2)=>{
                          let _aoi = _subject[subject]?.AOI_AVERAGE_20
                          let aoi = (_aoi && _aoi!==0)?roundOff(_subject[subject]?.AOI_AVERAGE_20, 0):'-'
                        
                          return(
                            <tr key={i2} className='border border-black  text-[15px]'>
                              <td style={{width:'25%'}} className={`border border-black py-${student?.num_subjects<10?'2':'1'}`}>{subject_full_name[subject]}</td>
                              <td className='border border-black text-center'> {aoi!=='-'? roundOff(_subject[subject]?.AOI_AVERAGE_20/20*3,1):'-'}</td>
                              <td className='border border-black text-center'> {aoi} </td>
                              <td className='border border-black flex-1 text-center font-semibold'>{aoi!=='-'?roundOff(_subject[subject]?.AOI_AVERAGE_20/20*100,0):'-'}</td>
                              <td className='border border-black text-center'>{_subject[subject]?.AOI_AVERAGE_GRADE || '-'}</td>
                              <td  className={`border border-black italic text-${_subject[subject]?.AOI_AVERAGE_COMMENT?'left':'center'}`}>{_subject[subject]?.AOI_AVERAGE_COMMENT || '-'}</td>
                        </tr>)
                      })}
                        
                        
                    </table>:
                  set_time.exam==='EOC'?
                  <table className='w-full'>
                        <tr className={`border border-black font-bold text-[15px]`}>
                            <td style={{width:'25%'}} className='border border-black p-1'>SUBJECT</td>
                            {reserve_exam.split('&')?.map((exm, exm_i)=>(
                              <td key={exm_i} className='border border-black flex-1 text-center'>{exm}</td>
                            ))}
                            <td className='border border-black text-center'>AVG(80)</td>
                            <td className='border border-black text-center'>AVG(100)</td>
                            <td className='border border-black text-center'>GRADE</td>
                            <td style={{width:'20%'}} className='border border-black text-center'>ACHIEVEMENT LEVEL</td>
                        </tr>
                        {Object.keys(_subject)?.map((subject, i2)=>{
                          
                          return _subject[subject]?.subjects?.map((subj, i3)=>{                            
                          
                            return(
                              <tr key={i3} className='border border-black  text-[15px]'>
                                  {
                                    i3===0 &&
                                  <>
                                    <td rowSpan={_subject[subject]?.subjects?.length} style={{width:'25%'}} className={`border border-black p-1 text-[15px] py-${student?.num_subjects<9?'2':'1'}`}>{subject_full_name[subject]}</td>
                                  </>

                                  }
                                {/*  */}
                                {
                                  Object.keys(subj.EXAM_80)?.map((exm, exm_i)=>( 
                                    <td key={exm_i} className={`border border-black text-center text-[15px] py-${student?.num_subjects<10?'2':'1'}`}> {roundOff(subj.EXAM_80[exm.trim()], 0)||'-'} </td>
                                  ))
                                }
                                {/*  */}
                                {i3===0 &&
                                  <>
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black flex-1 text-center font-semibold'>{roundOff(_subject[subject]?.EXAM_AVERAGE_80,0)||'-'}</td>
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black flex-1 text-center font-semibold'>{roundOff(_subject[subject]?.TOTAL,0)||'-'}</td>
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black text-center'>{_subject[subject]?.GRADE || '-'}</td>
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className={`border border-black italic text-${_subject[subject]?.COMMENT?'left':'center'}`}>{_subject[subject]?.COMMENT || '-'}</td>
                                  </>
                                }
                              </tr>
                            )
                          })
                      })}
                    </table>:
                  set_time.exam.includes('&')?
                  <table className='w-full'>
                        <tr className={`border border-black font-bold text-[15px] p-1`}>
                            <td style={{width:'25%'}} className='border border-black '>SUBJECT</td>
                            <td className='border border-black text-center '> AOI(3)</td>
                            <td className='border border-black text-center '> AOI(20)</td>
                            {set_time.exam.split('&')?.map((exm, exm_i)=>(
                              <td key={exm_i} className='border border-black flex-1 text-center'>{exm}</td>
                            ))}
                            <td className='border border-black text-center'>AVG(80)</td>
                            <td className='border border-black text-center'>TOTAL(100)</td>
                            <td className='border border-black text-center'>GRADE</td>
                            <td style={{width:'20%'}} className='border border-black text-center'>ACHIEVEMENT LEVEL</td>
                        </tr>
                        {Object.keys(_subject)?.map((subject, i2)=>{
                          let _aoi = _subject[subject]?.AOI_AVERAGE_20
                          let aoi = _aoi && _aoi!==0?roundOff(_subject[subject]?.AOI_AVERAGE_20, 0):'-'
                          
                          return _subject[subject]?.subjects?.map((subj, i3)=>{

                            return(
                              <tr key={i3} className='border border-black  text-[15px]'>
                                  {
                                    i3===0 &&
                                  <>
                                      <td rowSpan={_subject[subject]?.subjects?.length} style={{width:'25%'}} className={`border border-black p-1 text-[15px] py-${student?.num_subjects<9?'3':'1'}`}>{subject_full_name[subject]}</td>
                                      <td rowSpan={_subject[subject]?.subjects?.length} className='border border-black text-center text-[15px]'> {aoi && aoi!=='-'?roundOff(_subject[subject]?.AOI_AVERAGE_20/20*3,1):'-'}</td>
                                      <td rowSpan={_subject[subject]?.subjects?.length} className='border border-black text-center text-[15px] font-semibold'> {aoi && aoi!=='-'?roundOff(_subject[subject]?.AOI_AVERAGE_20, 0):'-'} </td>
                                    </>

                                  }
                                {/*  */}
                                {
                                  set_time.exam.split('&')?.map((exm, exm_i)=>( 
                                    <td key={exm_i} className={`border border-black text-center text-[15px] py-${student?.num_subjects<10?'2':'1'}`}> {roundOff(subj.EXAM_80[exm.trim()], 0)||'-'} </td>
                                  ))
                                }
                                {/*  */}
                                {i3===0 &&
                                  <>
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black flex-1 text-center font-semibold'>{roundOff(_subject[subject]?.EXAM_AVERAGE_80,0)||'-'}</td>
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black flex-1 text-center font-semibold'>{roundOff(_subject[subject]?.TOTAL,0)||'-'}</td>
                                    <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black text-center'>{_subject[subject]?.GRADE || '-'}</td>
                                    <td rowSpan={_subject[subject]?.subjects?.length} className={`border border-black italic text-${_subject[subject]?.COMMENT?'left':'center'}`}>{_subject[subject]?.COMMENT || '-'}</td>
                                  </>
                                }
                              </tr>
                            )
                          })
                      })}
                    </table>:
                    <table className='w-full'>
                        <tr className={`border border-black font-bold text-[15px] p-1`}>
                            <td style={{width:'25%'}} className='border border-black'>SUBJECT</td>
                            <td className='border border-black text-center '> AOI(3)</td>
                            <td className='border border-black text-center '> AOI(20)</td>
                            {set_time.exam.split('&')?.map((exm, exm_i)=>(
                              <td key={exm_i} className='border border-black flex-1 text-center'>{exm}</td>
                            ))}
                            <td className='border border-black text-center'>AVG(80)</td>
                            <td className='border border-black text-center'>TOTAL(100)</td>
                            <td className='border border-black text-center'>GRADE</td>
                            <td style={{width:'20%'}} className='border border-black text-center'>ACHIEVEMENT LEVEL</td>
                        </tr>
                        {Object.keys(_subject)?.map((subject, i2)=>{
                          
                          let _aoi = _subject[subject]?.AOI_AVERAGE_20
                          let aoi = _aoi && _aoi!==0?roundOff(_subject[subject]?.AOI_AVERAGE_20, 0):'-'
                          return _subject[subject]?.subjects?.map((subj, i3)=>{

                            return(
                              <tr key={i3} className='border border-black  text-[15px]'>
                                  {
                                    i3===0 &&
                                    <>
                                      <td rowSpan={_subject[subject]?.subjects?.length} style={{width:'25%'}} className={`border border-black p-1 text-[15px] py-${student?.num_subjects<9?'3':'1'}`}>{subject_full_name[subject]}</td>
                                      <td rowSpan={_subject[subject]?.subjects?.length} className='border border-black text-center text-[15px]'> {aoi!=='-'?roundOff(_subject[subject]?.AOI_AVERAGE_20/20*3,1):'-'}</td>
                                      <td rowSpan={_subject[subject]?.subjects?.length} className='border border-black text-center text-[15px] font-semibold'> {aoi!=='-'?roundOff(_subject[subject]?.AOI_AVERAGE_20, 0):'-'} </td>
                                    </>

                                  }
                                  {/*  */}
                                  {
                                    set_time.exam.split('&')?.map((exm, exm_i)=>( 
                                      <td key={exm_i} className={`border border-black text-center text-[15px] py-${student?.num_subjects<19?'2':'1'}`}> {aoi!=='-'?roundOff(subj.EXAM_80[exm.trim()], 0):'-'} </td>
                                    ))
                                  }
                                  {/*  */}
                                  {
                                    i3===0 &&
                                    <>
                                      <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black flex-1 text-center font-semibold'>{roundOff(_subject[subject]?.EXAM_AVERAGE_80,0)||'-'}</td>
                                      <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black flex-1 text-center font-semibold'>{roundOff(_subject[subject]?.TOTAL,0)||'-'}</td>
                                      <td rowSpan={_subject[subject]?.subjects?.length}  className='border border-black text-center'>{_subject[subject]?.GRADE || '-'}</td>
                                      <td rowSpan={_subject[subject]?.subjects?.length} className={`border border-black italic text-${_subject[subject]?.COMMENT?'left':'center'}`}>{_subject[subject]?.COMMENT || '-'}</td>
                                    </>}
                              </tr>
                            )
                          })
                      })}
                    </table>
                  }
                </WebReportLayout> 
                </>
            )})
          }
        </MainWebReportLayout>
        {open_title && <div className="w-full flex justify-center absolute top-10 left-0 print:hidden">
          <div className="bg-white border-2 border-slate-600 rounded-md py-2 shadow-2xl w-2/4 top-10 m-auto flex justify-center flex-col p-2 relative">
              <h4 className="text-center mx-auto text-teal-600 border-b-1 border-teal-600 py-2 text-2xl font-bold w-fit">CHANGE REPORT TITLE</h4>
              <div className="w-full py-4">
                <input value={title} onChange={(e)=>setTile(e.target.value?.toLocaleUpperCase())} type="text" className="border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-xl text-gray-800 w-full" />
              </div>
              <button onClick={()=>setOpenTitle(prev=>!prev)} className="absolute h-[25px] w-[25px] bg-slate-300 top-1 right-1 rounded-sm hover:bg-red-600 text-white">x</button>
            </div>
        </div>}
      </>
    );
    
  }else if(report_category=='report summary'){
    return ( 
      <MainWebReportLayout>
       <div className="flex space-x-5 border-t border-slate-300 py-2 justify-start items-center print:hidden">
          <button onClick={()=>setOpenTitle(prev=>!prev)} className="bg-slate-700 hover:bg-red-600 w-[100px] mb-2 top-1 right-1 rounded  text-white print:hidden">Edit Title</button>
          <ChangeExanAllAoiEoc/>
        </div>
        {/*  */}
        <OReportSummary title={title}/>
        {open_title && <div className="w-full flex justify-center absolute top-10 left-0 print:hidden">
          <div className="bg-white border-2 border-slate-300 rounded-md py-2 shadow-2xl w-2/4 top-10 m-auto flex justify-center flex-col p-2 relative">
              <h4 className="text-center mx-auto text-teal-600 border-b-1 border-teal-600 py-2 text-2xl font-bold w-fit">CHANGE REPORT TITLE</h4>
              <div className="w-full py-4">
                <input value={title} onChange={(e)=>setTile(e.target.value?.toLocaleUpperCase())} type="text" className="border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-xl text-gray-800 w-full" />
              </div>
              <button onClick={()=>setOpenTitle(prev=>!prev)} className="absolute h-[25px] w-[25px] bg-slate-300 top-1 right-1 rounded-sm hover:bg-red-600 text-white">x</button>
            </div>
        </div>}
      </MainWebReportLayout>
    );
  }else{
    return(
      <MainWebReportLayout>
        <div className="flex space-x-5 border-t border-slate-300 py-2 justify-start items-center print:hidden">
          <button onClick={()=>setOpenTitle(prev=>!prev)} className="bg-slate-700 hover:bg-red-600 w-[100px] mb-2 top-1 right-1 rounded  text-white print:hidden">Edit Title</button>
          <ChangeExanAllAoiEoc/>
        </div>
        {/*  */}
        <OReportGeneralSummary title={title}/>
        {open_title && <div className="w-full flex justify-center absolute top-10 left-0 print:hidden">
          <div className="bg-white border-2 border-slate-300 rounded-md py-2 shadow-2xl w-2/4 top-10 m-auto flex justify-center flex-col p-2 relative">
              <h4 className="text-center mx-auto text-teal-600 border-b-1 border-teal-600 py-2 text-2xl font-bold w-fit">CHANGE REPORT TITLE</h4>
              <div className="w-full py-4">
                <input value={title} onChange={(e)=>setTile(e.target.value?.toLocaleUpperCase())} type="text" className="border border-gray-400 rounded px-4 py-2 focus:outline-none focus:border-blue-500 text-xl text-gray-800 w-full" />
              </div>
              <button onClick={()=>setOpenTitle(prev=>!prev)} className="absolute h-[25px] w-[25px] bg-slate-300 top-1 right-1 rounded-sm hover:bg-red-600 text-white">x</button>
            </div>
        </div>}
      </MainWebReportLayout>
    )
  }
}
