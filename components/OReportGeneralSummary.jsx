import { useDataContext } from "@/context/DataProvider";
import { exam, roman_term, subject_full_name } from "@/utils/reportList";
import { colorTin, brightness } from "color-tin";
import {HeadedPaper, HorizontalDoubleLine} from "./Headers/HeadedPaper";
import { countAverageGrades, getSubjectGradeCount, getUniqueSubjects, roundOff} from "@/utils";
import OLevelGading from "./Report/OLevelGrading";
import WebGraph from '@/components/WebGraph'
import { Title } from "./StudentUpdateComponent";
import { useEffect, useState } from "react";

export default function OReportGeneralSummary({title}) {
  const {transformed_data,main_school_info,selected_clas,num_per_stream,theme_bg,set_time,gradings} = useDataContext();
  const [counted_grades, setCountedGrade ] = useState([])
  const [all_class_sammury, setAllClassSummary] = useState([])
  const exam = set_time.exam.split(' & ').reverse()[0]
  const clas = parseInt(selected_clas.split(' ')[1])
    // 
    useEffect(()=>{
        const _counted_grades = getSubjectGradeCount(transformed_data, uniqu_subject, exam, clas)
        setCountedGrade(_counted_grades)
        if(clas<5) {
            const _all_class_sammury = countAverageGrades(transformed_data, exam);
            setAllClassSummary(_all_class_sammury)
        }
    }, [exam])  
    // 

    let colors = colorTin(theme_bg, 10);
    let uniqu_subject = getUniqueSubjects(transformed_data);
    let table_heading = ['A', 'B', 'C', 'D', 'E', 'MISS',	'TOTAL']
    let grades = clas<5?gradings?.o_level:gradings?.a_level 
    table_heading = clas<5?table_heading: ['A', 'B', 'C', 'D', 'E', 'F', 'MISS', 'TOTAL']      

  return (
    <div className="w-full pb-4 bg-white relative">
        {/* page */}
        <div className="w-full relative min-h-screen break-inside-avoid print:w-screen print:h-screen print:min-h-screen print:break-after-page print:p-0">
            <div className="w-full sm:w-full print:w-full flex flex-col justify-evenly mx-auto">
                <div className="w-full hidden print:block">
                    <HeadedPaper />
                </div>
                <div className="relative w-full flex justify-center my-2">
                    <Title text={title?title:`${selected_clas} ${exam[set_time.exam]||"END OF CYCLE"} ${roman_term[set_time.term]} SUBJECT SUMMARY`}/>
                    <h6 className="absolute right-2 text-sm">
                        STREAM:{num_per_stream && Object.keys(num_per_stream?.streams)?.sort().join(" , ")}
                    </h6>
                </div>
                <div className="border-b flex gap-4 p-2 py-3 text-white" style={{ backgroundColor: theme_bg }}>
                    <h2 className="text-sm font-bold">
                        Class Size{" "}
                        <span style={{ backgroundColor: colors.lighter_40 }} className="mt-1 text-xs py-1 px-2 rounded text-white font-thin">
                            {transformed_data?.length}{" "}
                        </span>
                    </h2>
                </div>
                {/* Header */}
            </div>
            <table className="w-full">
                <tr className="font-mono" style={{color:theme_bg, color: brightness(theme_bg) < 65 ? theme_bg : "black", borderBottom: `2px solid ${theme_bg}`}}>
                    <th className="text-left w-[5%] pl-1">PSN</th>
                    <th className="text-left">SUBJECT</th>
                    {table_heading.map(grade=>(
                        <th className="flex-1 w-[10%]">{grade}</th>
                    ))}
                </tr>
                {counted_grades.map((subject, i)=>{
                    
                    return (
                        <tr key={i} className="font-mono " style={{backgroundColor:i % 2 === 0 ? "white" : colors.lighter_80, borderBottom: `${((counted_grades.length-1)==i)?'2px':'1px'} solid ${((counted_grades.length-1)==i)?theme_bg:colors.lighter_60}`}}>
                            <td className="text-left w-[5%] py-2 pl-1">{i+1}</td>
                            <td className="text-left">{subject_full_name[subject.subject]}</td>
                            {/*  */}
                            {table_heading.map(grade=>(
                                <td className="flex-1 w-[10%] text-center">{subject[grade]}</td>
                            ))}
                        </tr>
                    )
                })}
            </table>
            <div className="w-full absolute bottom-0">
                <div className="h-[7px] w-full border-0 mb-[3px]" style={{ backgroundColor: theme_bg }}/>
                <div className="h-[1px] w-full border-0 border-white" style={{ backgroundColor: theme_bg }}/>
            </div>
            <img
                className="absolute hidden print:block left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-15"
                width={"85%"}
                height={"85%"}
                src={main_school_info?.logo}/>
        </div> 
        {/* page */}
        <div className="w-full relative min-h-screen break-inside-avoid print:w-screen print:h-screen print:min-h-screen print:break-after-page print:p-0">
            <div className="w-full sm:w-full print:w-full flex flex-col justify-evenly mx-auto">
                <div className="w-full hidden print:block">
                    <HeadedPaper />
                    <HorizontalDoubleLine/>
                </div>
                <div className="relative w-full flex justify-center my-2">
                    <Title text={`${selected_clas} ${exam[set_time.exam]||'TERM'} ${roman_term[set_time.term]} GRAPHICAL REPRESENTATION`}/>
                    <h6 className="absolute right-2 text-sm">
                        STREAM:{num_per_stream && Object.keys(num_per_stream?.streams)?.sort().join(" , ")}
                    </h6>
                </div>
                
            </div>
            <WebGraph data={counted_grades}/>
            <HorizontalDoubleLine/>
            <img
                className="absolute hidden print:block left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-15"
                width={"85%"}
                height={"85%"}
                src={main_school_info?.logo}/>
        </div> 
        {/* page */}
        {clas<5 && 
        <div className="w-full relative min-h-screen break-inside-avoid print:w-screen print:h-screen print:min-h-screen print:break-after-page print:p-0">
            <div className="w-full sm:w-full print:w-full flex flex-col justify-evenly mx-auto">
                <div className="w-full hidden print:block">
                    <HeadedPaper />
                    <HorizontalDoubleLine/>
                </div>
                {/* Header */}
            </div>
            <div className="flex justify-between flex-wrap p-1">
            {all_class_sammury.map((class_sammury, all_idex)=>{
                return(
                    <div className="mb-[30px] w-[47%]" key={all_idex}>
                        <Title text={`${selected_clas} ${class_sammury['STREAM'] || 'GENERAL'} ${exam[set_time.exam]||"END OF CYCLE"} ${roman_term[set_time.term]} CLASS SUMMARY`}/>
                        <table className="w-full">
                            <tr className="text-sm font-mono" style={{ backgroundColor:theme_bg, color: brightness(theme_bg) < 65 ? "#fff" : "black", borderBottom: `2px solid ${theme_bg}`}}>
                                <th className="text-center w-[10%] pl-1">#</th>
                                <th className="text-left w-[50%]">GRADE</th>
                                <th className="text-center">NUMBER</th>
                                <th className="text-center">%AGE</th>
                                
                            </tr>
                            {table_heading.map((grade, i)=>{   
                                                             
                                
                                return (

                                    !(grade=="TOTAL"  ||grade=='MISS') && 
                                    <tr key={i} className="font-mono" style={{backgroundColor:i % 2 === 0 ? "white" : colors.lighter_80, borderBottom: `${((table_heading.length-3)==i)?'2px':'1px'} solid ${((table_heading.length-3)==i)?theme_bg:colors.lighter_60}`}}>
                                        <td className="text-center w-[10%] py-2 pl-1">{i+1}</td>
                                        <td className="text-left w-[50%]">{grade} <i >({grades?.comment[grade]})</i> </td>
                                        <td className="text-center">{class_sammury[grade]}</td>
                                        <td className="text-center">{roundOff(class_sammury[grade+'Per'],1)}</td>
                                        
                                    </tr>
                                )
                            })}
                        </table>
            </div>)})}
            </div>
            <HorizontalDoubleLine/>
            <img
                className="absolute hidden print:block left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-15"
                width={"85%"}
                height={"85%"}
                src={main_school_info?.logo}/>

        </div> 
        }
        {/* footer section */}
        <div>
            <div className="hidden relative print:block bg-white w-full min-h-screen break-inside-avoid print:w-full px-5 print:h-screen print:min-h-screen print:p-0">
            <HeadedPaper />
            <Title text={`${selected_clas} ${exam[set_time.exam]} ${roman_term[set_time.term]} GRADINGS`}/>
            <OLevelGading />
            <HorizontalDoubleLine/>
            <img className="absolute hidden print:block left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-15"
                width={"85%"} height={"85%"} src={main_school_info?.logo}/>
            </div>  
        </div>
    </div>
  );
}
