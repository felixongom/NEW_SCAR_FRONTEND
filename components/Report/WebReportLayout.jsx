"use client";
import { usePathname, useRouter } from 'next/navigation'
import { useDataContext } from "@/context/DataProvider";
import { useEffect } from "react";
import {HeadedPaper} from "@/components/Headers/HeadedPaper";
import OLevelGading from "@/components/Report/OLevelGrading";
import { exam, roman_term } from "@/utils/reportList";
import { roundOff } from '@/utils';
import {colorTin} from 'color-tin'
import { Title } from '../StudentUpdateComponent';


export default function WebReportLayout({children,student, extra_data, title}) {
  const {main_school_info, selected_clas,num_per_stream, set_time} = useDataContext()
  let clas = parseInt(selected_clas.split(' ')[1])
  //auth
  const router = useRouter()
  const pathname = usePathname(); 
  useEffect(()=>{    
    if(main_school_info) return router.push(pathname);
    if(!main_school_info) return router.push('/');
  },[])  
  
  // In your App.js
  let marks_key = set_time.exam=='AOI'?"AOI_TOTAL":set_time.exam=='EOC'?"EXAM_TOTAL":'TOTAL'
  let average_key = set_time.exam=='AOI'?"AOI_AVERAGE":set_time.exam=='EOC'?'EXAM_AVERAGE':'AVERAGE' //EXAM_AVERAGE_COMMENT
  let grade_key = set_time.exam=='AOI'?"AOI_AVERAGE_GRADE":set_time.exam=='EOC'?"EXAM_AVERAGE_GRADE":"AVERAGE_GRADE"//AVERAGE_COMMENT
  let comment_key = set_time.exam=='AOI'?"AOI_AVERAGE_COMMENT":set_time.exam=='EOC'?"EXAM_AVERAGE_COMMENT":"AVERAGE_COMMENT"
  let position_key = set_time.exam=='AOI'?"AOI_PSN":set_time.exam=='EOC'?"EXAM_PSN":"PSN"
  let stream_position_key = set_time.exam=='AOI'?"AOI_STREAM_PSN":set_time.exam=='EOC'?"EXAM_STREAM_PSN":"PSN_IN_STREAM"
  // let colors = colorTin(theme_bg, 10);
  

  return (
    <div className="sm:w-full print:w-full flex flex-col justify-evenly mx-auto">
      <div className="flex flex-col">
        
        {/* Outer Container: Stretches to fill the exact printed page height/width */}
        <div className="relative w-full min-h-screen break-inside-avoid print:w-full print:h-screen print:min-h-screen print:break-after-page print:p-0 border-[2px] border-gray-800">
          {/* Inner Container: Flex layout stretched to fill 100% of the parent container */}
          <div className="flex p-1 h-[200vh] flex-4 flex-col justify-between items-center print:h-[calc(100%-0px)] border-[6px] border-gray-500">
          <img className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-15" width={'90%'} height={'90%'} src={main_school_info.logo} />
            
            <HeadedPaper learner_pic={student.image} pics={'/person.png'}/>
            <section className='w-full'>
              <h4 className="relative flex items-center justify-center text-blue-800 font-bold text-[16px]">
                <Title text={title?title:(set_time.exam === 'EOC'? 'END OF CYCLE': exam[set_time?.exam.split('&').reverse()[0].trim()] || 'MID TERM') + ' REPORT'}/>
                <span className="absolute right-2 text-red-600 text-sm">
                  {student.learner_id}
                </span>
              </h4>
              <table className='w-full text-sm'>
                  <tr className='border border-blue-300 text-[15px]'>
                      <td className='border border-blue-300 px-1 py-2 flex-1'>NAME</td>
                      <td colSpan={3} className='border border-blue-300 px-1 flex-2 font-semibold'> {student['STUDENT NAME']}</td>
                      <td className='border border-blue-300 px-1 flex-1 w-[80px]'>YEAR</td>
                      <td className='border border-blue-300 px-1 text-center flex-2'>{set_time?.year}</td>
                      <td className='border border-blue-300 px-1 flex-1 w-[80px]'>TERM</td>
                      <td className='border border-blue-300 px-1 text-center flex-1 w-[150px]'>{roman_term[set_time?.term]}</td>
                      <td className='border border-blue-300 px-5 flex-1 w-[80px]'>CBN</td>
                      <td className='border border-blue-300 px-3 text-center flex-1'>{student?.combination}</td>
                  </tr>
                  <tr className='border border-blue-300 text-[15px]'>
                      <td className='border border-blue-300 px-1 py-2 flex-1'>SEX</td>
                      <td className='border border-blue-300 px-1 flex-2 text-center'> {student.SEX}</td>
                      <td className='border border-blue-300 px-1 flex-1'>CLASS</td>
                      <td className='border border-blue-300 px-1 text-center flex-2'>{selected_clas}</td>
                      <td className='border border-blue-300 px-1 flex-1'>STREAM</td>
                      <td className='border border-blue-300 px-1 text-center flex-1'>{student.STREAM}</td>
                      <td className='border border-blue-300 px-1 flex-1'>PAY CODE</td>
                      <td colSpan={3} style={{width:'12%'}} className='border border-blue-300 px-1 text-center flex-1'>{student.pay_code}</td>
                  </tr>
              </table>
            </section>
            
            <section className='w-full flex gap-1 flex-col'>
              {children}
              {clas<5 && 
                <table className='w-full text-sm'>
                  <tr className='border border-gray-500 text-[16px]'>
                    <td rowSpan={2} className='border border-gray-500 px-1 text-center'>OVERALL ACHIEVEMENT</td>
                    <td colSpan={2} className='border border-gray-500 px-1 flex-2 text-center '> TOTAL SCORE({Object.keys(student.subjects)?.length*100})</td>
                    <td colSpan={2} className='border border-gray-500 px-1 flex-2 text-center '> AVERAGE SCORE(100)</td>
                    <td className='border border-gray-500 px-1 flex-1 text-center'>GRADE</td>
                    <td className='border border-gray-500 px-1 text-center flex-2'>DESCRIPTOR</td>
                  </tr>
                  <tr className='border border-gray-500 text-[16px]'>
                    <td colSpan={2} className='border border-gray-500 px-1 text-center italic'>{roundOff(student[marks_key],0)}</td>
                    <td colSpan={2} className='border border-gray-500 px-1 flex-2 text-center italic'> {roundOff(student[average_key], 1)} </td>
                    <td  className='border border-gray-500 px-1 flex-2 text-center italic'> {student[grade_key]} </td>
                    <td className='border border-gray-500 px-1 flex-1 text-center capitalize italic'>{student[comment_key]}</td>
                  </tr>
                </table>
              }
            </section>

            {/* Position in class and in stream */}
            <section className='flex flex-col gap-4 w-full'>
              {extra_data.put_position?
                  <div className="flex justify-between w-full border-b-2 border-black text-[15px]">
                      <div>
                          Position in stream:{" "}
                          <span className="font-semibold">{student?.[stream_position_key]}</span> out of{" "}
                          <span className="font-semibold">{num_per_stream?.streams?.[student.STREAM]}</span>
                      </div>
                      <div>
                          Position in class:{" "}
                          <span className="font-semibold">{student?.[position_key]}</span> out of{" "}
                          <span className="font-semibold">{num_per_stream.total}</span>
                      </div>
                  </div>
              :null}
              {/* Reporting and ending date for next term */}
              <div className='w-full text-[15px]'>
                  Next term Begins on:{" "}
                  <span className="font-bold">{extra_data.begins?extra_data.begins:'__ / __ / ____'}</span> and ends on{" "}
                  <span className="font-bold">{extra_data.ends?extra_data.ends:'__ / __ /____'}</span>
              </div>
            </section>
    
            {/* eacher's comment*/}
              <div className='w-full border-b border-dashed border-gray-700 text-[15px]'>Class Teacher's Comment:</div>
              <div className='w-full border-b border-dashed border-gray-700 text-[15px]'>Head Teacher's Comment:</div>
            
            {/* Grading System */}
            <section className='w-full gap-1'>
              <OLevelGading font_size="sm"/>
              <p className='italic text-xs w-full text-center py-1'> A:activity of integration, AOI:Average of Activity of Integration, BOT:Beginning of Term, MOT:Mid of Term EOT:End of Term</p>
            </section>
          </div>
        </div>      
      </div>
    </div>
  );
}
