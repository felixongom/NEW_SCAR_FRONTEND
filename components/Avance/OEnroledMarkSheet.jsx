'use client';
import { useState, useMemo} from "react";
import { useDataContext } from "@/context/DataProvider";
import { HeadedPaper } from "../Headers/HeadedPaper";
import { Title } from "../StudentUpdateComponent";
import { a_subject_full_name, exam, roman_term } from "@/utils/reportList";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import {colorTin} from 'color-tin'
import { roundOff } from "@/utils";
// DATA GRID
import { DataGrid } from "react-gridix";
import "react-gridix/style.css";

const OEnroledMarkSheet = ({ enroled, loading, setUpdateStudent, setSelectWhatToExport, setSelectWhatToDelete, subject_name, selectStudents, selected_students, sheet, setSheet }) => {
  const [editedIds, setEditedIds] = useState(new Set()); // track edited rows
  const { theme_bg,set_time, selected_clas } = useDataContext();
  const[toggle_show_hide_text, setToggleShowHideText] = useState(true)
  const[toggle_show_hide_header, setToggleShowHideHeader] = useState(false)
  const [sort_column, setSortColumn]= useState({})
  // 
  let clas = parseInt(selected_clas.split(' ')[0])

  const paperColumns = useMemo(() => {
    if (!enroled.length) return [];
    let labels = Object.keys(enroled[0].papers).map((paperKey, idx) => ({
      field: `marks.${paperKey}`,
      headerName: `PAPER ${idx + 1}`,
      type:'number',
      editable: true,
      width: '100px',
      align:'center',
      validate:(value)=>'' || null || undefined || (Number(value) >=0 && Number(value)<=80),
      validationMessage:'Allowed only 0 t0 80',
    }));
    
    let ict_marks =  {
      field: 'ict_marks.paper_1',
      headerName: `TOTAL`,
      width: '100px',
      editable:false,
      align:'center',
      type:'number',
    }
    // push ict total marks
    if(enroled[0].ict_marks && clas<5 ) {
      labels.push(ict_marks)
    }
    return [...labels]
  }, [clas, enroled]);  


  //building aoi column
  const aoiColumns = useMemo(() => {
    if (!enroled.length) return [];
    let labels = Object.keys(enroled[0]?.aoi_marks || {}).map((paperKey, idx) => ({
      field: `aoi_marks.${paperKey}`,
      headerName: `A${idx + 1}`,
      width: '100px',
      editable:true,
      validate:(value)=>'' || null || undefined || (Number(value) >=0 && Number(value)<=20),
      validationMessage:'Allowed only 0 t0 20',
      align:'center',
      type:'number',
    }));
    return [...labels]
  }, [enroled]);  


  const columnDefs = useMemo(() =>[
      { field: "learner_id", headerName: "#", type: "sequence", width: '40px', align:'left' },
      { field: "learner", headerName: "LEARNER", sortable:true, resizable:true, editable:false, width:'180px', align:'left', overflow: "ellipsis" },
      { field: "gender", headerName: "SEX", editable:false, align:'center'},
      { field: "stream", headerName: "STREAM", editable:false, sortable:true, align:'center'},
      ...aoiColumns,
      ...paperColumns,
      { field: "average_aoi", headerName: "AOI", type:'number', cellClassName:'font-semibold', editable:false, align:'center', valueFormatter:(value)=>(value===0?'':String(value || ''))},
      { field: "marks_plas_aoi", headerName: "TOTAL", cellClassName:'font-semibold', editable:false, sortable:true, align:'center'},
      { field: "grade_letter", headerName: "GRADE", editable:false, sortable:true, cellClassName:'italic', align:'center'},
      { field: "marks_comment", headerName: "COMMENT", editable:false, sortable:true, align:'left', cellClassName:'italic',overflow: "ellipsis", headerClassName:'text-xs p-1'},
    ], [paperColumns]);
  // 

  const onUpdateRows = () => setUpdateStudent(editedIds.filter(mark=>mark.id));
  // 
  const sortData = (column)=>{
    const active_column = sort_column[column]=='asc'?'desc':'asc'
    setSortColumn({[column]:active_column})
  }
  // 
  function onCellEdit({field, newValue, row}){
    const field_array = field.split('.')
    let field_id

    if(field?.includes('aoi')){
      field_id = row['aoi_id']?.[field_array[1]+'_id']

    }else{
      let paper_id = field_array[1].split('_')[1] 
      field_id = row['marks_id']?.[`marks_${paper_id}_id`]
    }
    // 
    const edited_object = {id:field_id, mark:Number(newValue)}
    setEditedIds(prev=>prev?[...prev, edited_object]:[edited_object])
  }

  let colors = colorTin(theme_bg, 10);
  const class_list = _.orderBy(enroled, [Object.keys(sort_column)[0]], [Object.values(sort_column)[0]])  
  // 
  
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="py-4 relative flex px-1 mb-[10px] border-b border-gray-300 print:hidden">
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
         {sheet && (
            <button
              className="bg-orange-700 hover:bg-orange-500 rounded transition text-gray-100 px-2 py-1 text-xs"
              onClick={onUpdateRows}>
              Save
            </button>
         )}
        <div className="flex items-center gap-2 top-2 right-1 absolute text-sm">
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
            <span className="font-xs">{!toggle_show_hide_text?'SHOW':'HIDE'} MARKS</span>
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
      <div className="w-full">
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
          stickyHeader
          
          triped
          stripeColors={['#fff', colors.lighter_90]}
          rowClassName={({grade_letter})=>{
            return `${grade_letter<'B'?'text-green-600':grade_letter>'C'?'text-red-600':''}`
           }}
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
      </div>
      
      :

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
              className="mt-1 text-xs py-1 px-2 rounded text-white"
            >
              {enroled?.length}{" "}
            </span>
          </h2>
          <button className={`px-2 py-1 text-xs text-center ${selected_students.length==0 &&'hidden'}`} style={{backgroundColor:colors.lighter_30}}>{selected_students?.length} selected</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`font-mono md:text-sm font-bold w-full`}
              style={{
                color:theme_bg,
                borderBottom:`2px solid ${theme_bg}`
              }}
            >
              <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[4%] py-2 print:hidden">
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
              <th style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center w-[4%] py-2 print:py-1">NO.</th>
              <th onClick={()=>sortData('learner')} style={{border:`1px solid ${theme_bg}`}} className="px-1 text-left w-[25%] cursor-pointer">LEARNER&apos;S NAME</th>
              <th onClick={()=>sortData('stream')} style={{border:`1px solid ${theme_bg}`}} className="w-[5%] text-center cursor-pointer">STREAM</th>
              {(toggle_show_hide_text?Object.keys(enroled[0]?.aoi_marks || {}):['AOI 1', 'AOI 2', 'AOI 3']).map((_, i)=>(
                <th key={i} style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">AOI {i+1}(x/20)</th> 
              ))}
              {toggle_show_hide_text &&  <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">AOI(x/20)</th> }
              {(toggle_show_hide_text?Object.keys(enroled[0]?.marks || {}):['BOT', 'MOT', 'EOT']).map((exam, i)=>(
                <th key={i} style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center">{exam?.toLocaleUpperCase()}(x/80)</th> 
              ))}
              {toggle_show_hide_text && 
              <>
                <th onClick={()=>sortData('marks_plas_aoi')} style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[5%] text-center cursor-pointer">TOTAL</th>
                <th onClick={()=>sortData('grade_letter')} style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[5%] text-center cursor-pointer">GRADE</th>
                <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[15%] text-center print:hidden">COMMENT</th>
              </>
              }
            </tr>
          </thead>
          {class_list?.map((learner, i)=>{
            let row_backround =  selected_students.includes(learner.learner_id)?'#ccffe6':(i%2==1? colors.lighter_90:'white')
            return(
              <tr key={i} style={{backgroundColor:row_backround}} className={`font-mono md:text-sm ${toggle_show_hide_text && learner.grade_letter>'C'?'text-red-600':(toggle_show_hide_text && learner.grade_letter)<'B'?'text-[#009900]':''}`}>
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
                <td style={{border:`1px solid ${theme_bg}`}} className="px-1 py-2 print:py-1 text-center">{i+1}</td>
                <td style={{border:`1px solid ${theme_bg}`}} className="px-1 text-left">{learner.learner}</td>
                <td style={{border:`1px solid ${theme_bg}`}} className="text-center">{learner.stream}</td>
                {(toggle_show_hide_text?Object.values(learner?.aoi_marks || {}):['-','-','-']).map((aoi, i)=>(
                  <td key={i} style={{border:`1px solid ${theme_bg}`}} className="text-center w-[10%]">{toggle_show_hide_text && (aoi || '-')}</td> 
                ))}
                {toggle_show_hide_text &&  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center w-[10%]">{(learner.average_aoi || '-')}</td>  }
                {(toggle_show_hide_text?Object.values(learner?.marks || {}):['-','-','-']).map((marks, i)=>(
                  <td key={i} style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center w-[10%]">{toggle_show_hide_text && (marks || '-')}</td> 
                ))}
                {toggle_show_hide_text && 
                <>
                  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center">{ roundOff(learner.marks_plas_aoi, 0)}</td>
                  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 italic text-center">{learner.grade_letter}</td>
                  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 italic print:hidden">{learner.marks_comment}</td>
                </>
                }
              </tr>
            )
          })}
        </table>
      </div>
      }
    </div>
  );
};

export default OEnroledMarkSheet;

