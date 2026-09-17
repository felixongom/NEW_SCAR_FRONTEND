'use client';
import { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ExportToExcel from '@/hooks/useExportMarks';
import {pairMarksWithIds} from "@/utils/reshpe_data"
import { useDataContext } from "@/context/DataProvider";

const EnroledMarkSheet = ({ enroled, setDeleteStudent, setUpdateStudent }) => {
  const gridApiRef = useRef(null);              // stores the grid API
  const [editedIds, setEditedIds] = useState(new Set()); // track edited rows
  const { theme_bg } = useDataContext();

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


  // console.log(enroled)
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ marginBottom: "10px" }}>
        <ExportToExcel 
          data={enroled} 
          theme_bg={theme_bg} 
          />
        <button
          className="bg-red-700 hover:bg-red-500 rounded-lg transition text-gray-100 px-2 text-sm"
          onClick={onDeleteRow}
          style={{ marginLeft: "10px" }}
        >
          Delete Selected
        </button>
        <button
          className="bg-orange-700 hover:bg-orange-500 rounded-lg transition text-gray-100 px-2 py-1"
          onClick={onUpdateRows}
          style={{ marginLeft: "10px" }}
        >
          Save
        </button>
      </div>

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
      </div>
    </div>
  );
};

export default EnroledMarkSheet;
