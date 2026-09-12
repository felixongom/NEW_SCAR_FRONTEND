import { useEffect, useState } from "react";
import { paginate, roundOff, rowColor } from "@/utils/index";
import { useDataContext } from "@/context/DataProvider";
import PaperOrientation from "@/components/PaperOrientation";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import Pages from "@/components/Pages";
import { brightness } from "color-tin";
import _ from "lodash";
import { colorTin } from "color-tin";
import {HeadedPaper, HorizontalDoubleLine} from "@/components/Headers/HeadedPaper"
import { exam, roman_term } from "@/utils/reportList";
import { RiArrowDownLine, RiBrush2Line } from "react-icons/ri";
import { Title } from "./StudentUpdateComponent";
import OLevelGading from "./Report/OLevelGrading";
//
export default function AResultTable({ table_heading, setShowDeletingPopup,setShowPaycodePopup, setShowPopUp, selected_student, setSelectedStudent }) {
  //
  const { transformed_data, data_chunk, theme_bg, dispatch, set_time, selected_clas } = useDataContext();
  const [size, setResizingData] = useState({page:1, perpage:100})
  const [sortby, setSortBy] = useState({changed:true})
  const [painted, setPainted] = useState(false)
  //
  let d = transformed_data
    ? paginate(transformed_data, { perpage: size.perpage, page:size.page })
    : null;
  //
  const handleParamChange = (newValue) => {
    setResizingData(prev=>({...prev, page:newValue}))
  };

  //
  const searchStudents = (search_term) => {
    const filtered = _.filter(
      transformed_data,
      (item) =>
        item["STUDENT NAME"]
          ?.toLowerCase()
          .includes(search_term.toLowerCase()) ||
        item["learner_id"]?.toLowerCase().includes(search_term) ||
        item["STREAM"]?.toLowerCase() === search_term ||
        item["combination"]?.toLowerCase().includes(search_term.toLowerCase()),
    );
    dispatch({ type: "DATA_CHUNK", payload: filtered });
  };
  //
  const toggleStudent = (id) => {
    if (id === true) {
      let ids = transformed_data.map((student) => student.id);
      selected_student.length
        ? setSelectedStudent([])
        : setSelectedStudent(ids);
    } else {
      setSelectedStudent((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    }
  };
  //
  useEffect(() => {
    dispatch({ type: "DATA_CHUNK", payload: d?.data });
  }, [size.page, size.perpage]);

  //
  useEffect(() => {
    dispatch({ type: "DATA_CHUNK", payload: d?.data });
    delete sortby.changed
    let sorted = _.orderBy(transformed_data, [Object.keys(sortby)], [Object.values(sortby)])
    dispatch({ type: "TRANSFORMED_DATA", payload: sorted })

  }, [sortby.changed]);

  const handlePrintOneReport = (student) => {
    setShowPopUp((prev) => !prev);
    dispatch({ type: "DATA_CHUNK", payload: student });
  };
//sorting record
const sortData = (header)=>{    
    if(sortby[header]===undefined){
        setSortBy({[header]:'asc', changed:!sortby.changed })
    }else if(sortby[header]==='asc'){
        setSortBy({[header]:'desc', changed:!sortby.changed })
    }else if(sortby[header]==='desc'){
        // delete sortby[header]
        setSortBy({})
    }
} 

  let colors = colorTin(theme_bg, 10);
  const table_header = {'STUDENT ID':'learner_id',"LEARNER'S NAME":'STUDENT NAME', 'SEX':'SEX','STREAM':'STREAM', 'CBN':'combination',  'PAPERS':'num_papers', 'SUBJECTS':'num_subjects', 'POINTS':'total_points','S_PSN':'PSN_IN_STREAM', 'PSN':'PSN'}
  
// console.log(data_chunk);

  return (
    <div className="p-1 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-2 bg-white">
        <div className="p-1 print:hidden w-3/4">
          <div className="flex w-full flex-row justify-between">
            <PaperOrientation />
            <div>
              <p className="text-xs md:text-sm text-gray-600"> Pages</p>
              <Pages
                handleParamChange={handleParamChange}
                d={d}
                page={size.page}
                theme_bg={theme_bg}
              />
            </div>
            <div>
              <span className="text-gray-600 text-xs md:text-sm">Page</span>
              <select
                value={size.perpage}
                onChange={(e) => setResizingData(prev=>({...prev, perpage:e.target.value}))}
                className="ml-1 max-w-xs px-2 w-[70px] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs text-xs md:text-sm"
              >
                {[100, 130, transformed_data?.length].map(
                  (opt, index) => (
                    <option key={index} value={opt}>
                      {opt}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>

        {data_chunk && (
            
          <div className="flex gap-2 ml-2 print:hidden">
             <button onClick={()=>setShowDeletingPopup(prev=>!prev)}  className={`${!selected_student.length>0?'hidden':null} bg-gray-100 text-rose-700 rounded-lg border-rose-900 border-1 text-sm py-1 px-3`}>Darks</button>
            <button
              style={{
                  borderColor: colors.lighter_80,
                  backgroundColor: painted? theme_bg: '#fff',
                  borderWidth:1,
                  color:painted?'#fff': theme_bg,
                }}
                onClick={() => setPainted(prev=>!prev)}
              className="flex gap-1 px-1 rounded transition text-xs md:text-sm"
            > 
              <RiBrush2Line style={{fontSize:18}}/> <span className="font-xs">Paint</span>
            </button>
            <button
              style={{
                  borderColor: theme_bg,
                  borderWidth:1,
                  color: theme_bg,
                }}
                onClick={() => print()}
              className="flex gap-1 px-1 rounded transition text-xs md:text-sm"
            > 
              <MdOutlineLocalPrintshop style={{fontSize:18}}/> <span className="font-xs">page</span>
            </button>
            <button
              style={{
                  backgroundColor: colors.darker_10,
                  color: brightness(theme_bg) < 65 ? "white" : "black",
                }}
                onClick={() => setShowPopUp((prev) => !prev)}
                className="text-white p-1 rounded-md transition text-xs md:text-sm"
                >
              <MdOutlineLocalPrintshop  style={{fontSize:18}}/>
            </button>
          </div>
        )}
      </div>
      {/* Header */}
      <div className="w-full hidden print:block">
        <HeadedPaper/>
        <Title text={`${selected_clas } ${exam[set_time.exam]} ${roman_term[set_time.term]} SUMMARY`}/>
      </div>
      <div
        className="border-b flex gap-4 p-2 py-3 text-white"
        style={{ backgroundColor: theme_bg }}
      >
        <h2 className="text-sm font-bold">
          Class Size{" "}
          <span
            style={{ backgroundColor: colors.lighter_40 }}
            className="mt-1 text-xs py-1 px-2 rounded text-white font-thin"
          >
            {transformed_data?.length}{" "}
          </span>
        </h2>
        <input
          onChange={(e) => searchStudents(e.target.value)}
          className="px-2 py-1 focus:border-0 text-xs border-collapse text-gray-700 print:hidden"
          type="text"
          placeholder="Search student . . ."
        />
        <button
          className="px-2 py-0 text-xs text-center print:hidden"
          style={{ backgroundColor: colors.lighter_30 }}
        >
          {selected_student?.length} selected
        </button>
      </div>
      {/* Header */}

      <table className="w-full border-collapse overflow-hidden shadow-md print:text-2xl">
        <thead
          style={{
            color: brightness(theme_bg) < 65 ? theme_bg : "black",
            borderBottom: `2px solid ${theme_bg}`
          }}
          className={`bg-gray-100`}
        >
          <tr className="font-mono text-sm md:text-[15px]" >
            <td className=" p-1 text-left flex-1">#</td>
            <td className="px-1 text-left print:hidden">
              <button
                style={{
                  borderColor: selected_student.length ? theme_bg : "#999",
                }}
                onClick={() => toggleStudent(true)}
                className={`flex h-4 w-4  items-center justify-center border transition bg-white
                    ${selected_student.length ? "border-green-600" : "border-gray-500"}`}
              >
                {selected_student.length ? (
                  <span
                    className="h-2 w-2 rounded-sm"
                    style={{ backgroundColor: theme_bg }}
                  />
                ) : null}
              </button>
            </td>

            {Object.keys(table_header).map((header, i)=>{
                return(
                    <td 
                    onClick={()=>sortData(table_header[header])}
                    className=  {`font-semibold text-${i==0|i==1|i==2|i==4?'left':'center'} flex-2`}>
                        <div className={`flex gap-1 justify-${i==0|i==1|i==2?'left':'center'} w-full text-center cursor-pointer`}>
                            <span>{header} {Object.keys(sortby).includes(header)}</span>
                            {Object.keys(sortby).includes(table_header[header]) && 
                            <RiArrowDownLine className={`mt-1 ${sortby[header]==='asc'?'rotate-0':sortby[header]==='desc'?'rotate-180':null} transition print:hidden font-thin`}/>}
                        </div>
                    </td>
                )
            })}
            <td className="p-1 font-semibold flex justify-center flex-1 text-xs md:text-sm print:hidden">
              <button className="px-2 rounded-full bg-stone-700 text-white" title="Export/Import Pay Code" onClick={()=>setShowPaycodePopup(prev=>!prev)}>CODE</button>
            </td>
            <td className="p-1 font-bold text-center flex-1 text-xs md:text-sm print:hidden">
              ACTION
            </td>
          </tr>
        </thead>
        <tbody className="bg-white">
          {!data_chunk || (data_chunk && data_chunk.length === 0) ? (
            <tr className="flex w-full justify-center">
              <td className="w-full flex-1">No Student in {table_heading}</td>
            </tr>
          ) : (
            data_chunk?.map((student, index) => (
              <tr
                style={{
                    backgroundColor:selected_student.includes(student.id)? colors.lighter_70: index%2==1?'#f2f2f2':'white',
                    borderBottomColor:selected_student.includes(student.id)?'#fff':colors.lighter_70,
                    color:!painted?(student["num_subjects"]!==5?'#be0202':'black'):
                    student["total_points"]<6?'#be0202':(student["total_points"]>=15?'#01ad01':'black'),
                    borderBottom: `${((data_chunk.length-1)==index)?'3px':'1px'} solid ${((data_chunk.length-1)==index)?theme_bg:colors.lighter_70}`
                  }}
                key={index}
                className={`border-t font-mono text-sm md:text-[15px] hover:bg-gray-200 ${rowColor(student["AVG"]) } bg-[${theme_bg}]`}
              >
                <td className="flex-1 py-2 capitalize">
                  {(parseInt(size.page) - 1) * parseInt(size.perpage) + index + 1}
                </td>
                <td className="px-1 print:hidden">
                  <button
                    style={{
                      borderColor: selected_student.includes(student.id)
                        ? theme_bg
                        : "#999",
                    }}
                    onClick={() => toggleStudent(student.id)}
                    className={`flex h-4 w-4  items-center justify-center border transition`}
                  >
                    {selected_student.includes(student.id) ? (
                      <span
                        className="h-2 w-2"
                        style={{ backgroundColor: theme_bg }}
                      />
                    ) : null}
                  </button>
                </td>
                <td className="flex-1">
                  {student["learner_id"]}
                </td>
                <td className="flex-2">
                  {student["STUDENT NAME"]}
                </td>
                
                <td className="flex-1 capitalize text-center">
                  {student["SEX"] && 
                  student["SEX"]?.toUpperCase()==='FEMALE'?'F':student["SEX"]?.toUpperCase()==='MALE'?'M':student["SEX"]?.toUpperCase()}
                </td>
                <td
                  className={`text-center flex-1 capitalize`}
                >
                  {student["STREAM"]}
                </td>
                <td className="flex-2">
                  {student["combination"]}
                </td>
                
                <td className="text-center flex-1 uppercase">
                  {student["num_papers"]}
                </td>
                <td className="text-center flex-1">
                  {student["num_subjects"]}
                </td>
                <td className="flex-1 text-center">
                  {student["total_points"]}
                </td>
                <td className="flex-1 text-center">
                  {student["PSN_IN_STREAM"]}
                </td>
                <td className="flex-1 text-center">
                  {student["PSN"]}
                </td>
                <td className="flex-1 capitalize text-center print:hidden">
                  {student["pay_code"] || "-"}
                </td>
                <td className="flex flex-row gap-2 flex-1 justify-center print:hidden">
                  <button
                    style={{ backgroundColor: `${theme_bg}` }}
                    onClick={() => handlePrintOneReport([student])}
                    className="bg-gray-800 text-white p-1 rounded-md hover:bg-gray-900 transition text-xs md:text-sm"
                  >
                    <MdOutlineLocalPrintshop />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pages
        handleParamChange={handleParamChange}
        d={d}
        page={size.page}
        theme_bg={theme_bg}
      />
      {/*  */}
      <div className="hidden relative print:block bg-white w-full min-h-screen break-inside-avoid print:w-screen print:h-screen print:min-h-screen print:p-0">
        <HeadedPaper/>
        <Title text={`${selected_clas } ${exam[set_time.exam]} ${roman_term[set_time.term]} GRADINGS`}/>
        <OLevelGading/>
        <HorizontalDoubleLine/>
      </div> 
    </div>
  );
}
