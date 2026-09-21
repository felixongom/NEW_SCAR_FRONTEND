'use client';
import { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ExportToExcel from '@/hooks/useExportMarks';
import {pairMarksWithIds} from "@/utils/reshpe_data"
import { useDataContext } from "@/context/DataProvider";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { HeadedPaper } from "../Headers/HeadedPaper";
import { Title } from "../StudentUpdateComponent";
import {a_subject_full_name, exam, roman_term } from "@/utils/reportList";
import {colorTin} from 'color-tin'

const EnroledMarkSheet = ({ enroled, setDeleteStudent, setUpdateStudent, subject_name }) => {
  const gridApiRef = useRef(null);              // stores the grid API
  const [editedIds, setEditedIds] = useState(new Set()); // track edited rows
  const[sheet, setSheet] = useState(true)
  const[toggle_show_hide_text, setToggleShowHideText] = useState(true)
  const { theme_bg,set_time, selected_clas} = useDataContext();

  const cellStyle = { display: 'flex', alignItems: 'center' };

  const paperColumns = useMemo(() => {
    if (!enroled.length) return [];
    let labels = Object.keys(enroled[0].papers).map((paperKey, idx) => ({
      field: `marks.${paperKey}`,
      headerName: `PAPER ${idx + 1}`,
      editable: true,
      width: 100,
      cellStyle: { ...cellStyle, justifyContent: 'center' }
    }));
    
    let ict_marks =  {
      field: 'ict_marks.paper_1',
      headerName: `TOTAL`,
      editable: false,
      width: 100,
      cellStyle: { ...cellStyle, justifyContent: 'center' }
    }
    // push ict total marks
    if(enroled[0].ict_marks ) {
      labels.push(ict_marks)
    }
    return [...labels]
  }, [enroled]);


  const columnDefs = useMemo(() =>[
      { headerCheckboxSelection: true, checkboxSelection: true, width: 40, cellStyle },
      { field: "sequence", headerName: "NO", editable: false, width: 80, cellStyle },
      { field: "learner", headerName: "LEARNER", cellStyle },
      { field: "stream", headerName: "STREAM", width: 100, cellStyle },
      ...paperColumns,
      { field: "marks_string_05", headerName: "HOLDER", width: 100, cellStyle: { ...cellStyle, justifyContent: 'center' } },
      { field: "grade_string", headerName: "SCORE", width: 100, cellStyle: { ...cellStyle, justifyContent: 'center' } },
      { field: "grade_letter", headerName: "GRADE", width: 100, cellStyle: { ...cellStyle, justifyContent: 'center' } },
      { field: "comment", headerName: "COMMENT", cellStyle: { ...cellStyle, flex:3,fontFamily: 'Arial'} },
    ], [paperColumns]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const getRowStyle = (params) => {
    const subj = params.data.papers.paper_1.split(' ')[0];
    if (['GP', 'ICT', 'SM'].includes(subj) && [9, 8, 7].includes(params.data.grades[0])) {
      return { color: "#cc0000" };
    } else if (['GP', 'ICT', 'SM'].includes(subj) && [3,4,5,6].includes(params.data.grades[0])) {
      return { color: "#000000" };
    
    } else if (['GP', 'ICT', 'SM'].includes(subj) && [1, 2].includes(params.data.grades[0])) {
      return { color: "#009900" };
    }else if (params.data.grade_letter === 'A') {
      return { color: "#009900" };
    }else if (['E','F','O'].includes(params.data.grade_letter)) {
      return { color: "#cc0000" };
    }
  };

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  // Track edited rows
  const onCellValueChanged = (params) => {
    // use a unique key for each row; here we assume "sequence" is unique
    setEditedIds(prev => {
      const next = new Set(prev);
      next.add(params.data.sequence);
      return next;
    });
  };

  const onDeleteRow = () => {
    const api = gridApiRef.current;
    if (!api) return;
    const selectedNodes = api.getSelectedNodes();
    const selectedIds = selectedNodes.map(node => Object.values(node.data.marks_id));
    selectedIds.length && setDeleteStudent(selectedIds.flat());
  };

  const onUpdateRows = () => {
    
    const api = gridApiRef.current;
    if (!api) return;
    
    const editedRows = [];
    api.forEachNode(node => {
      if (editedIds.has(node.data.sequence)) {
        editedRows.push(node.data);
      }
    });
    
    let edited = pairMarksWithIds(editedRows.map(row=>({marks:row.marks, marks_id:row.marks_id})));
    setUpdateStudent(edited);

  };

  const height = enroled ? window.innerHeight : 50;
  let colors = colorTin(theme_bg, 10);

  console.log(enroled)
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="py-4 relative flex px-1 mb-[10px] border-b border-gray-300 print:hidden" style={{ marginBottom: "10px" }}>
        {sheet && (
          <>
            <ExportToExcel 
              data={enroled} 
              theme_bg={theme_bg} 
              />
            <button
              className="bg-red-700 ml-2 hover:bg-red-500 rounded transition text-gray-100 px-2 py-1 text-xs"
              onClick={onDeleteRow}
            >
              Delete Selected
            </button>
            <button
              className="bg-orange-700 hover:bg-orange-500 rounded transition text-gray-100 px-2 py-1 text-xs"
              onClick={onUpdateRows}
              style={{ marginLeft: "10px" }}
            >
              Save
            </button>
          </>
        )}
        <div className="flex items-center gap-2 top-2 right-1 absolute">
          <button
            style={{
              borderColor: theme_bg,
              borderWidth:1,
              color: theme_bg,
            }}
            onClick={() => setToggleShowHideText(prev=>!prev)}
            className={`flex gap-1 px-1 rounded transition text-xs md:text-sm ${!sheet && 'hidden'}`}> 
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
        <AgGridReact
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}    
          getRowStyle={getRowStyle}
          rowData={enroled}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressClickEdit={false}
          singleClickEdit={true}
          enterNavigatesVertically={true}
          enterNavigatesVerticallyAfterEdit={true}
          rowHeight={38}
        />
      </div>:
      <div>
        <div className="w-full hidden print:block print:-mt-2">
          <HeadedPaper subject_name={subject_name}/>
          <Title text={`${selected_clas } ${exam[set_time.exam]} ${roman_term[set_time.term]} ${a_subject_full_name[subject_name]||subject_name}`}/>
        </div>
        <div
        className="border-b flex gap-4 p-2 py-3 text-white"
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

        </div>
        <table className="w-full">
          <thead>
            <tr className={`font-mono text-[15px] font-bold w-full`}
              style={{
                color:theme_bg,
                borderBottom:`2px solid ${theme_bg}`
              }}
            >
              <th style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center w-[4%] py-2 ">ID</th>
              <th style={{border:`1px solid ${theme_bg}`}} className="px-1 text-left w-[25%]">LEARNER'S NAME</th>
              <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[8%] text-center">STREAM</th>
              
              {(toggle_show_hide_text?Object.keys(enroled[0]?.marks || {}):['EOC 1', 'EOC 1', 'EOC 1']).map((_, i)=>(
                <th key={i} style={{border:`1px solid ${theme_bg}`}} className="px-1 text-center">EOC {i+1}(%)</th> 
              ))}
              {toggle_show_hide_text && 
              <>
                <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">SCORES(x/5)</th>
                <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">GRADES</th>
                <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">AVG GRD</th>
                <th style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[15%] text-center">COMMENT</th>
              </>
              }
            </tr>
          </thead>
          {enroled?.map((learner, i)=>{
            return(
              <tr style={{backgroundColor:i%2==1? colors.lighter_90:'white'}} className={`font-mono text-[15px]`}>
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
                  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 w-[10%] text-center">{ learner.grade_letter}</td>
                  <td style={{border:`1px solid ${theme_bg}`}} className="px-1 italic">{learner.comments}</td>
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
