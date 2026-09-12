'use client';
import { useState, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import OExportToExcel from '@/hooks/useOExportMarks';
import {pairMarksWithIds} from "@/utils/reshpe_data"
import { useDataContext } from "@/context/DataProvider";
import {colorTin} from 'color-tin'

const OEnroledMarkSheet = ({ enroled, setDeleteStudent, setUpdateStudent }) => {
  const gridApiRef = useRef(null);              // stores the grid API
  const [editedIds, setEditedIds] = useState(new Set()); // track edited rows
  const { theme_bg, selected_clas } = useDataContext();
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

  //building aoi column
  const aoiColumns = useMemo(() => {
    if (!enroled.length) return [];
    let labels = Object.keys(enroled[0]?.aoi_marks || {}).map((paperKey, idx) => ({
      field: `aoi_marks.${paperKey}`,
      headerName: `A${idx + 1}`,
      editable: true,
      width: 60,
      cellStyle: { ...cellStyle, justifyContent: 'center' }
    }));
    return [...labels]
  }, [enroled]);  


  const columnDefs = useMemo(() =>[
      { headerCheckboxSelection: true, checkboxSelection: true, width: 40, cellStyle },
      { field: "sequence", headerName: "NO", editable: false, width: 80, cellStyle },
      { field: "learner", headerName: "LEARNER", width:250, cellStyle },
      { field: "stream", headerName: "STREAM", width: 100, cellStyle:{ ...cellStyle, justifyContent: 'center' } },
      ...aoiColumns,
      ...paperColumns,
      { field: "average_aoi", headerName: "AOI", width: 100, cellStyle:{...cellStyle, justifyContent:'center', fontWeight:'700'} },
      { field: "marks_plas_aoi", headerName: "TOTAL", width: 100, cellStyle: { ...cellStyle, justifyContent: 'center',fontWeight:'700' } },
      { field: "grade_letter", headerName: "GRADE", width: 100, cellStyle: { ...cellStyle, justifyContent: 'center' } },
      { field: "marks_comment", headerName: "COMMENT", width: 100, cellStyle: { ...cellStyle, justifyContent: 'left', fontStyle:'italic' } },
    ], [paperColumns]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
  }), []);

  const getRowStyle = (params) => {
    let clas = parseInt(selected_clas.split(' ')[0])
    const subj = params.data.papers.paper_1.split(' ')[0];

    if (clas>4 && ['GP', 'ICT', 'SM'].includes(subj) && [9, 8, 7].includes(params?.data?.grades[0])) {
      return { color: "#cc0000" };
    } else if (clas>4 && ['GP', 'ICT', 'SM'].includes(subj) && [3,4,5,6].includes(params?.data?.grades[0])) {
      return { color: "#000000" };
    } else if (clas>4 && ['GP', 'ICT', 'SM'].includes(subj) && [1, 2].includes(params?.data?.grades[0])) {
      return { color: "#009900" };
    }else if (params.data.grade_letter === 'A') {
      return { color: "#009900" };
    }else if (['E','D'].includes(params?.data?.grade_letter)) {
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
    const selectedIds = selectedNodes.map(node => Object.values(node.data?.marks_id));
    const selectedAoiIds = selectedNodes.map(node => {
      return node.data?.aoi_id && Object.values(node.data?.aoi_id)
    });
    selectedIds.length && setDeleteStudent([...selectedIds, ...selectedAoiIds].flat().filter(id=>id));
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
    let aoi_edited = pairMarksWithIds(editedRows.map(row=>({marks:row.aoi_marks, marks_id:row.aoi_id})), 'aoi');
    setUpdateStudent([...edited, ...aoi_edited]);
  };

  const height = enroled ? window.innerHeight : 50;
  // let colors = colorTin(theme_bg, 10)
  

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="py-3 px-1 border-t border-gray-300" style={{ marginBottom: "10px"}}>
        <OExportToExcel 
          data={enroled} 
          theme_bg={theme_bg} 
          />
        <button
          className="bg-red-700 hover:bg-red-500 rounded-lg transition text-gray-100 px-2 py-1 text-sm"
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

export default OEnroledMarkSheet;
