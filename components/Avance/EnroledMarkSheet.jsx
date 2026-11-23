'use client';
import { useState, useMemo } from "react";
import { useDataContext } from "@/context/DataProvider";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { HeadedPaper } from "../Headers/HeadedPaper";
import { Title } from "../StudentUpdateComponent";
import {a_subject_full_name, exam, roman_term } from "@/utils/reportList";
import {colorTin} from 'color-tin'
import _ from 'lodash'
// DATA GRID
import { DataGrid } from "react-gridix";
import "react-gridix/style.css";

const EnroledMarkSheet = ({ enroled,  loading, setUpdateStudent, setSelectWhatToExport,setSelectWhatToDelete, subject_name, selectStudents, selected_students,  sheet, setSheet }) => {
  const [editedIds, setEditedIds] = useState(new Set()); // track edited rows
  const[toggle_show_hide_text, setToggleShowHideText] = useState(true)
  const { theme_bg,set_time, selected_clas} = useDataContext();
  const [sort_column, setSortColumn]= useState({})
  const[toggle_show_hide_header, setToggleShowHideHeader] = useState(false)
  // 
  const paperColumns = useMemo(() => {
    if (!enroled.length) return [];
    let labels = Object.keys(enroled[0].papers).map((paperKey, idx) => ({
      field: `marks.${paperKey}`,
      headerName: `PAPER ${idx + 1}`,
      editable: true,
      width: '100px',
      align:'center',
      validate:(value)=>'' || null || undefined || (Number(value) >=0 && Number(value)<=100),
    }));
    // 
    let ict_marks =  {
      field: 'ict_marks.paper_1',
      headerName: `TOTAL`,
      editable: false,
      width: 100,
      align:'center',
    }
    // push ict total marks
    if(enroled[0].ict_marks ) {
      labels.push(ict_marks)
    }
    return [...labels]
  }, [enroled]);

  // 

  const columnDefs = useMemo(() =>[
    { field: "learner_id", headerName: "#", type: "sequence", width: '40px', align:'left' },
    { field: "learner", headerName: "LEARNER", sortable:true, editable:false, width:'180px', align:'left', overflow: "ellipsis" },
    { field: "gender", headerName: "SEX", editable:false, align:'center', valueFormatter:(value)=>value?.toLowerCase()?.includes('female')?'F':'M'},
    { field: "stream", headerName: "STREAM", editable:false, sortable:true, align:'center'},
    ...paperColumns,
    { field: "marks_string_05",editable:false, headerName: "HOLDER", width: 100, align:'center'},
    { field: "grade_string", headerName: "SCORE",editable:false, width: 100, align:'center',cellClassName:'italic'},
    { field: "grade_letter", headerName: "GRADE",editable:false, width: 100, align:'center', sortable:true, cellClassName:'italic'},
    { field: "comment", headerName: "COMMENT", editable:false, width:'140px', overflow:'ellipsis', editable:false,cellClassName:'italic'},
  ], [paperColumns]);

  // 
  function onCellEdit({field, newValue, row}){
    const field_array = field.split('.')
    let paper_id = field_array[1].split('_')[1] 
    let field_id = row['marks_id'][`marks_${paper_id}_id`]
    // 
    const edited_object = {id:field_id, mark:Number(newValue)}
    setEditedIds(prev=>prev?[...prev, edited_object]:[edited_object])
  }
  
  const onUpdateRows = () => setUpdateStudent(editedIds.filter(mark=>mark.id));

  const sortData = (column)=>{
    const active_column = sort_column[column]=='asc'?'desc':'asc'
    setSortColumn({[column]:active_column})
  }

  const height = enroled ? window.innerHeight : 50;
  let colors = colorTin(theme_bg, 10);
  const class_list = _.orderBy(enroled, [Object.keys(sort_column)[0]], [Object.values(sort_column)[0]])
  

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="py-4 relative flex px-1 mb-[10px] border-b border-gray-300 print:hidden" style={{ marginBottom: "10px" }}>
        {!sheet && (
          <>
            <button
              onClick={()=>setSelectWhatToExport(prev=>!prev)}
              className={`rounded transition text-gray-100 px-2 py-1 text-xs ${ !selected_students.length && 'hidden'}`}
              style={{backgroundColor:theme_bg}}
            >Export Selected</button>
            <button
              className={`bg-red-700 ml-2 hover:bg-red-500 rounded transition text-gray-100 px-2 py-1 text-xs ${ !selected_students.length && 'hidden'}`}
              onClick={()=>setSelectWhatToDelete(prev=>!prev)}
            >
              Delete Selected
            </button>
          </>
        )}
        {sheet && (<button
          className="bg-orange-700 hover:bg-orange-500 rounded transition text-gray-100 px-2 py-1 text-xs"
          onClick={onUpdateRows}
          style={{ marginLeft: "10px" }}
        >
          Save
        </button>)}
        <div className="flex items-center gap-2 top-2 right-1 absolute">
          <button
            style={{
              borderColor: theme_bg,
              borderWidth:1,
              color: theme_bg,
            }}
            onClick={() => setToggleShowHideHeader(prev=>!prev)}
            className={`flex gap-1 px-1 rounded transition text-xs md:text-sm ${sheet && 'hidden'}`}> 
            <span className="font-xs">{!toggle_show_hide_header?'SHOW':'HIDE'} HEADER</span>
          </button>
          <button
            style={{
              borderColor: theme_bg,
              borderWidth:1,
              color: theme_bg,
            }}
            onClick={() => setToggleShowHideText(prev=>!prev)}
            className={`flex gap-1 px-1 rounded transition text-xs md:text-sm ${sheet && 'hidden'}`}> 
            <span className="font-xs">{!toggle_show_hide_text?'SHOW':'HIDE'}</span>
          </button>
          <button
            style={{
              borderColor: theme_bg,
              borderWidth:1,
              color: theme_bg,
            }}
            onClick={() => print()}
            className={`flex gap-1 px-1 rounded transition text-xs md:text-sm ${sheet && 'hidden'}`}> 
            <MdOutlineLocalPrintshop style={{fontSize:18}}/> <span className="font-xs">PRINT</span>
          </button>
          <button
            className={`${sheet===true?'bg-green-700':'bg-slate-900'} ${sheet===true?'hover:bg-green-500':'hover:bg-slate-800'} rounded transition text-gray-100 px-2 py-1 text-xs`}
            onClick={()=>setSheet(prev=>!prev)}
            >
              {!sheet?'DATA ENTRY':'MARKSHEET'}
          </button>
        </div>
      </div>

      {sheet?
      <div className="ag-theme-alpine" style={{ height, width: "100%" }}>
        <DataGrid
          columns={columnDefs}
          rows={enroled || []}//
          getRowId={(r) => r.learner_id }
          className="shadow-none rounded-md"
          searchable
          searchPlaceholder="Search students . . ."
          emptyMessage="No Data Yet . . ."
                 
          loading={loading}
          loadingRows={12}
          editable
          onCellEdit={onCellEdit}
          enterMovesDown
          keyboardNavigation
               
          triped
          stripeColors={['#fff', colors.lighter_90]}
          rowClassName={({grade_letter})=>`${grade_letter<'B'?'text-green-600':grade_letter>'C'?'text-red-600':''}`}
          classNames={{
            search: "rounded-md border-slate-300 px-1 py-1 focus:border-slate-800",
            row: "font-mono font-lg",
            footer: "bg-slate-800 text-slate-100",
            toolbar: "px-4 py-3 print:hidden",
            table:'min-w-[1000px] md:min-w-full',
            cell: "py-2 h-full", // styling the cell
            editor:'h-[25px] focus:border-slate-400', 
            pageButton: "rounded-fulll font-bold bg-white text-black hover:bg-red-600",
          }}
          // 
          styles={{
            toolbar:{background:colors.lighter_90},
            headerCell:{background:'#fff', borderBottom:`2px solid ${theme_bg}`, color:theme_bg, fontWeight:700,  fontSize:'12px', paddingBottom:'10px', paddingTop:'10px'},
            cell:{borderBottom:`1px solid ${colors.lighter_70}`,}
          }}/>
      </div>:
      <div>
        <div className={`w-full ${toggle_show_hide_header && 'hidden'} print:block`}>
          <HeadedPaper subject_name={subject_name}/>
          <Title text={`${selected_clas } ${exam[set_time.exam]} ${roman_term[set_time.term]} ${a_subject_full_name[subject_name]||subject_name} RESULTS`}/>
        </div>
        <div
        className="border-b flex gap-4 p-2 py-3 text-white print:hidden"
        style={{ backgroundColor: theme_bg }}>
          <h2 className="text-sm font-bold">
            Class Size{" "}
            <span
              style={{ backgroundColor: colors.lighter_40 }}
              className="mt-1 text-xs py-1 px-2 rounded text-white font-thin"
            >
              {enroled?.length}{" "}
            </span>
          </h2>
          <button className={`px-2 py-1 text-xs text-center ${selected_students.length==0 &&'hidden'}`} style={{backgroundColor:colors.lighter_30}}>{selected_students?.length} selected</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`font-mono text-[15px] font-bold w-full`}
              style={{
                color:theme_bg,
                borderBottom:`2px solid ${theme_bg}`
              }}
            >
            
              <th style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center w-[4%] py-2 print:py-1 print:hidden">
                <div className="w-full h-full flex justify-center items-center">
                  <button
                    style={{
                    borderColor: selected_students.length ? theme_bg : "#999",
                    }}
                    onClick={() => selectStudents(true)}
                    className={`flex h-4 w-4  items-center justify-center border transition bg-white`}
                    >
                     {selected_students.length ? (
                      <span
                      className="h-2 w-2 rounded-sm"
                      style={{ backgroundColor: theme_bg }}
                    />
                    ) : null}
                </button>
                </div>
              </th>
              <th style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center w-[4%] py-2 print:py-1">ID</th>
              <th style={{border:`1px solid ${theme_bg}`}} className="px-1 text-left w-[20%] cursor-pointer"
              onClick={()=>sortData('learner')}
              >LEARNER&apos;S NAME</th>
              <th onClick={()=>sortData('stream')} style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[8%] text-center cursor-pointer">STREAM</th>
              
              {(toggle_show_hide_text?Object.keys(enroled[0]?.marks || {}):['EOC 1', 'EOC 1', 'EOC 1']).map((_, i)=>(
                <th key={i} style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center">PAPER {i+1}(%)</th> 
              ))}
              {toggle_show_hide_text && 
              <>
                <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">SCORES(x/5)</th>
                <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">GRADES</th>
                <th onClick={()=>sortData('grade_letter')} style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center cursor-pointer">AVG GRD</th>
                <th onClick={()=>sortData('comments')} style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[15%] text-center cursor-pointer">COMMENT</th>
              </>
              }
            </tr>
          </thead>
          {class_list?.map((learner, i)=>{
            
            return(
              <tr 
              key={i}
              style={{
                backgroundColor:i%2==1? colors.lighter_90:'white',
                borderBottom:(class_list.length-1===i)?`2px solid ${theme_bg}`:''
                }} className={`font-mono md:text-sm ${(toggle_show_hide_text && learner.grade_letter)>'C'?'text-red-600':(toggle_show_hide_text && learner.grade_letter)<'B'?'text-[#009900]':''}`}>
                
                <td style={{border:`1px solid ${theme_bg}`}} className="px-1 py-2 print:hidden">
                  <div className="w-full h-full flex justify-center items-center">
                    <button
                    style={{
                      borderColor: selected_students.includes(learner.learner_id) ? theme_bg : "#999",
                      }}
                      onClick={() => selectStudents(learner.learner_id)}
                      className={`flex h-4 w-4  items-center justify-center border transition bg-white`}
                      >
                      {selected_students.includes(learner.learner_id) ? (
                        <span
                        className="h-2 w-2 rounded-sm"
                        style={{ backgroundColor: theme_bg }}
                      />
                      ) : null}
                    </button>
                  </div>
                </td>
                <td style={{border:`1px solid ${theme_bg}`}} className="px-1 py-2 text-center">{i+1}</td>
                <td style={{border:`1px solid ${theme_bg}`}} className="px-1 text-left">{learner.learner}</td>
                <td style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">{learner.stream}</td>
                {(toggle_show_hide_text?Object.values(learner?.marks || {}):['-','-','-']).map((marks, i)=>(
                  <td key={i} style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center w-[10%]">{toggle_show_hide_text && marks}</td> 
                ))}
                {toggle_show_hide_text && 
                <>
                  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">{ learner.marks_string_05}</td>
                  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">{ learner.grade_string}</td>
                  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center italic">{ learner.grade_letter}</td>
                  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 italic">{learner.comment}</td>
                </>
                }
              </tr>
            )
          })}
        </table>
      </div>}
    </div>
  );
};

export default EnroledMarkSheet;
