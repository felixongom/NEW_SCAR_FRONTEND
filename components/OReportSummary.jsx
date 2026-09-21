import { useDataContext } from "@/context/DataProvider";
import { exam, roman_term } from "@/utils/reportList";
import { colorTin, brightness } from "color-tin";
import {HeadedPaper, HorizontalDoubleLine} from "./Headers/HeadedPaper";
import { useEffect, useState } from "react";
import { getUniqueSubjects, roundOff } from "@/utils";
import { RiArrowDownLine, RiBrush2Line } from "react-icons/ri";
import OLevelGading from "./Report/OLevelGrading";
import { Title } from "./StudentUpdateComponent";

export default function OReportSummary({title}) {
  const {
    transformed_data,
    main_school_info,
    selected_clas,
    num_per_stream,
    theme_bg,
    set_time,
  } = useDataContext();
  const [_transformed_data, setTranformData] = useState(transformed_data);
  const [sortby, setSortBy] = useState({ changed: true });
  const [painted, setPainted] = useState(false);
  const [toggle_marks, setToggleMarks] = useState(true);
  const [toggle_avg, setToggleAvg] = useState(true);

  useEffect(() => {
    delete sortby.changed;
    let sorted = _.orderBy(
      transformed_data,
      [Object.keys(sortby)],
      [Object.values(sortby)],
    );
    setTranformData(sorted);
  }, [sortby.changed]);

  //sorting record
  const sortData = (header) => {
    if (sortby[header] === undefined) {
      setSortBy({ [header]: "asc", changed: !sortby.changed });
    } else if (sortby[header] === "asc") {
      setSortBy({ [header]: "desc", changed: !sortby.changed });
    } else if (sortby[header] === "desc") {
      delete sortby[header];
      setSortBy({ changed: !sortby.changed });
    }
  };

    let colors = colorTin(theme_bg, 10);
    let uniqu_subject = getUniqueSubjects(transformed_data);
    let grade_key = set_time.exam=='AOI'?"AOI_AVERAGE_GRADE":set_time.exam=='EOC'?"EXAM_AVERAGE_GRADE":"AVERAGE_GRADE"//AVERAGE_COMMENT
    let overal_average = set_time.exam=='AOI'?"AOI_AVERAGE":set_time.exam=='EOC'?'EXAM_AVERAGE':'AVERAGE' //EXAM_AVERAGE_COMMENT
    // 

  return (
    <div className="w-full pb-4 bg-white">
            
            <div className="flex gap-2 print:hidden w-full justify-between py-2 border-t border-gray-300">
                <div className="flex space-x-4">
                    <button
                        style={{
                        borderColor: colors.lighter_80,
                        backgroundColor: painted? theme_bg: '#fff',
                        borderWidth:1,
                        color:painted?'#fff': theme_bg,
                        }}
                        onClick={() => setPainted((prev) => !prev)}
                        className="flex gap-1 px-1 rounded transition text-xs md:text-sm"
                        >
                        <RiBrush2Line style={{ fontSize: 20 }} />{" "}
                        <span className="font-xs">Paint</span>
                    </button>
                </div>
                <div className="flex gap-2">
                <button
                    onClick={() => setToggleAvg((prev) => !prev)}
                    className={`bg-${toggle_avg ? "gray-800" : "white"} px-2 hover:px-3 transition-all duration-200 ease-in-out py-1 text-${toggle_avg ? "white" : "gray-800"} border border-gray-400 text-xs capitalize shadow-md`}
                    >
                    {!toggle_marks ? "Show Overall" : "Hide Overall"}
                </button>
                <button
                    onClick={() => setToggleMarks((prev) => !prev)}
                    className={`bg-${toggle_marks ? "gray-800" : "white"} px-2 hover:px-3 transition-all duration-200 ease-in-out py-1 text-${toggle_marks ? "white" : "gray-800"} border border-gray-400 text-xs capitalize shadow-md`}
                    >
                    {!toggle_marks ? "Grade" : "Marks"}
                </button>
                </div>
            </div>
            {/* Header */}
            <div className="w-full relative">
                <div className="w-full hidden print:block">
                    <HeadedPaper />
                </div>
                <div className="relative w-full flex justify-center my-2">
                    <Title text={title?title:`${selected_clas} ${exam[set_time.exam]||"END OF CYCLE"} ${roman_term[set_time.term]} SUMMARY`}/>
                <h6 className="absolute right-2 text-sm">
                    STREAM:
                    {num_per_stream &&
                    Object.keys(num_per_stream?.streams)?.sort().join(" , ")}
                </h6>
                </div>
                <div
                className="border-b flex gap-4 p-2 h-[60px] text-white"
                style={{ backgroundColor: theme_bg }}
                >
                <h2 className="text-sm font-bold">
                    Class Size 
                    <span
                    style={{ backgroundColor: colors.lighter_40 }}
                    className="mt-1 text-xs py-1 px-2 rounded text-white font-thin"
                    >
                    {transformed_data?.length}{" "}
                    </span>
                </h2>
                </div>
                {/* Header */}

                <table className="w-full border-collapse overflow-hidden shadow-md print:text-2xl relative -mt-5">
                    <thead
                        style={{
                            color: brightness(theme_bg) < 65 ? theme_bg : "black",
                            borderBottom: `2px solid ${theme_bg}`,
                        }}
                        className={`bg-gray-50 `}
                    >
                        <tr 
                            className="font-mono"
                            style={{
                            color: brightness(theme_bg) < 65 ? theme_bg : "black",
                            borderBottom: 2, 
                            borderBottomColor: theme_bg
                        }}
                        >
                        <td className="w-[2.5%] p-1 text-center flex-1 font-semibold">
                            #
                        </td>
                        <td
                            onClick={() => sortData("STUDENT NAME")}
                            className={`p-1 font-semibold flex-2 transition-all duration-200 ease-in-out`}
                        >
                            <div className={`flex gap-1 cursor-pointer`}>
                            <span className="">LEARNER'S NAME</span>
                            {Object.keys(sortby).includes("STUDENT NAME") && (
                                <RiArrowDownLine
                                className={`mt-1 ${sortby["AVERAGE"] === "asc" ? "rotate-0" : sortby["AVERAGE"] === "desc" ? "rotate-180" : ""} transition print:hidden font-thin`}
                                />
                            )}
                            </div>
                        </td>
                        <td
                            className=" p-1 text-center font-semibold transition-all duration-200 ease-in-out"
                            onClick={() => sortData("STREAM")}
                            >
                            STREAM
                        </td>

                        {uniqu_subject.map((subject, i) => {
                            return (
                            <td
                            key={i}
                                className={`p-1 font-semibold text-center flex-2 text-xs md:text-sm`}
                            >
                                {subject}
                            </td>
                            );
                        })}
                        <td
                            onClick={() => sortData(grade_key)}
                            className={`p-1 font-semibold flex-1 text-xs md:text-sm`}
                        >
                            <div
                            className={`flex gap-1 justify-center w-full text-center cursor-pointer`}
                            >
                            <span className="text-center">AVG</span>
                            {Object.keys(sortby).includes("AVERAGE") && (
                                <RiArrowDownLine
                                className={`mt-1 ${sortby["AVERAGE"] === "asc" ? "rotate-0" : sortby["AVERAGE"] === "desc" ? "rotate-180" : ""}  transition-all duration-200 ease-in-out print:hidden font-thin`}
                                />
                            )}
                            </div>
                        </td>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {!_transformed_data ||
                        (_transformed_data && _transformed_data.length === 0) ? (
                        <tr className="flex w-full justify-center">
                            <td colSpan={7} className="w-full flex-1">No Student found</td>
                        </tr>
                        ) : (
                           [... _transformed_data

                           ]?.map((student, index) => {
                            
                            
                                return (
                                <tr
                                    style={{
                                        backgroundColor:index % 2 === 0 ? "#fff" : colors.lighter_80,
                                        borderBottom: `${((_transformed_data.length-1)==index)?'3px':'1px'} solid ${((_transformed_data.length-1)==index)?theme_bg:colors.lighter_60}`,
                                        color: !painted
                                        ? "black"
                                        : student[grade_key] === "A"
                                        ? "#01ad01"
                                        : student[grade_key] >= "E"
                                        ? "#be0202"
                                        : "black",
                                    }}
                                    key={index}
                                    className={`font-mono text-sm md:text-[15px] border-t hover:bg-gray-200 transition duration-800`}
                                >
                                <td className="p-1 py-2 print:py-1  flex-1 capitalize">
                                {index + 1}
                                </td>

                                <td className="p-1 flex-2">
                                {student["STUDENT NAME"]}
                                </td>

                                <td
                                className={`p-1 text-center flex-1 capitalize`}
                                >
                                {student["STREAM"]}
                                </td>

                                {uniqu_subject.map((subject, i) => {
                                    let is_my_subject = Object.keys(student.subjects||{}).includes(subject)  
                                    const marks_grade_key = set_time.exam==='AOI'?'AOI_AVERAGE_GRADE':set_time.exam==='EOC'?'EXAM_AVERAGE_GRADE':'GRADE'                                  
                                    const marks_score_key = set_time.exam==='AOI'?'AOI_AVERAGE_20':set_time.exam==='EOC'?'EXAM_AVERAGE_80':'TOTAL'                                  
                                    
                                return (
                                    <td
                                    key={i}
                                    className={`p-1 text-center flex-1 capitalize`}
                                    >
                                    {is_my_subject &&
                                    (toggle_marks//
                                        ? student.subjects?.[subject]?.[marks_grade_key]||'-'
                                        : roundOff(student.subjects?.[subject]?.[marks_score_key], 0) || '-')}
                                    </td>
                                );
                                })}

                                <td className="p-1 text-center flex-1">
                                {
                                toggle_avg
                                    ? "-"
                                    : toggle_marks
                                    ? student[grade_key] || '-'
                                    : roundOff(student[overal_average], 1)||'-'}
                                </td>
                            </tr>
                            );
                        })
                        )}
                    </tbody>
                </table>
            </div>
        
        {/* footer section */}
        <div className="hidden relative print:block bg-white w-full min-h-screen break-inside-avoid print:w-full px-5 print:h-screen print:min-h-screen print:p-0">
            <HeadedPaper />
            <Title text={`${selected_clas} ${exam[set_time.exam]} ${roman_term[set_time.term]} GRADINGS`}/>
            <OLevelGading />
            <HorizontalDoubleLine/>
            <img
                className="absolute hidden print:block left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-15"
                width={"95%"}
                height={"95%"}
                src={main_school_info?.logo}
            />
        </div>
    </div>
  );
}
