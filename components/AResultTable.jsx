import { useState } from "react";
import Link from "next/link";
import { useDataContext } from "@/context/DataProvider";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { brightness } from "color-tin";
import { colorTin } from "color-tin";
import {HeadedPaper, HorizontalDoubleLine} from "@/components/Headers/HeadedPaper"
import { exam, roman_term } from "@/utils/reportList";
import { RiBrush2Line } from "react-icons/ri";
import { Title } from "./StudentUpdateComponent";
import OLevelGading from "./Report/OLevelGrading";
import { IoDocumentTextOutline } from "react-icons/io5";
// DATA GRID
import { DataGrid } from "react-gridix";
import "react-gridix/style.css";
//
export default function AResultTable({transformed_data, loading, setShowDeletingPopup,setShowPaycodePopup, selected_student, setSelectedStudent }) {
  //
  const { theme_bg, dispatch, set_time, selected_clas } = useDataContext();
  const [painted, setPainted] = useState(false)

  //
  let colors = colorTin(theme_bg, 10)
  
  const toggleStudent = (id) => {
    if (id === true) {
      let ids = transformed_data.map((student) => student.id);
      if(selected_student.length){
        setSelectedStudent([])
      }else{
        setSelectedStudent(ids);
      }
    } else {
      setSelectedStudent((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    }
  };
  //
  
  const handlePrintOneReport = (student) => {
    dispatch({ type: "DATA_CHUNK", payload: student });
  };


 //RG-GRID
 function toolBarOptions(){
    return(
      <div className="flex gap-2 ml-2 print:hidden">
            <button onClick={()=>setShowDeletingPopup(prev=>!prev)}  className={`${!selected_student.length>0?'hidden':null} bg-gray-100 text-rose-700 rounded border-rose-900 border-2 text-sm px-3`}>Delete</button>
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
              className={`flex gap-1 px-1 rounded transition text-xs md:text-sm`}
            > 
              <MdOutlineLocalPrintshop style={{fontSize:18}}/> <span className="font-xs">Page</span>
            </button>
            <button
              >
              <Link 
                className="flex gap-1 px-1 rounded transition text-xs md:text-sm" 
                style={{
                    backgroundColor: colors.darker_10,
                    color: brightness(theme_bg) < 65 ? "white" : "black",
                  }}
                href='/A/web-o-report'>
                  <IoDocumentTextOutline className="text-sm mt-1"/>
                  <span className="font-xs">Reports</span>
              </Link>
            </button>
          </div> 
    )
  }
  function linkRenderer({row}){
      return(
        <Link
          href={'/A/web-o-report'}
          style={{ backgroundColor: theme_bg }}
          onClick={() => handlePrintOneReport([row])}
          className="text-white rounded transition p-[2px] print:hidden"
          >
            <MdOutlineLocalPrintshop />
        </Link>
      )
  }
  //DATA GRID
  function checkBoxRenderer({value,row}){
    return(
      <button
        style={{borderColor:selected_student.length?theme_bg:'#999'}}
          onClick={() => toggleStudent(value)}
          className={`flex h-4 w-4  items-center justify-center border transition print:hidden
          ${selected_student.includes(row.id)? "border-green-600": "border-gray-500"}`}>
          {selected_student.includes(row.id) ? <span className="h-2 w-2 rounded-sm" style={{backgroundColor:theme_bg}}/>:null}
      </button>
    )
  }
  function headerCheckBoxRenderer(){
    return(
      <button
        style={{borderColor:selected_student.length?theme_bg:'#999'}}
          onClick={() => toggleStudent(true)}
          className={`flex h-4 w-4  items-center justify-center border transition print:hidden
          ${selected_student.length? "border-green-600": "border-gray-500"}`}>
          {selected_student.length ? <span className="h-2 w-2 rounded-sm" style={{backgroundColor:theme_bg}}/>:null}
      </button>
    )
  }
  
  function codeRenderer(){
    return(
      <button
        onClick={()=>setShowPaycodePopup(prev=>!prev)}
        className={`bg-slate-800 text-gray-100 px-2 rounded-full`}>
          CODE
      </button>
    )
  }
 
  const columns = [
    { 
        field: "id", headerName: "#", align:'center',
        headerClassName:'font-semibold text-xs', 
        width:"40px",overflow: "ellipsis", 
        type: "sequence",
      },
      { 
        field: "id", headerClassName:'text-xs p-1', 
        overflow: "ellipsis",
        width:'45px',
        align:'center',
        cellRenderer:checkBoxRenderer, 
        headerRenderer:headerCheckBoxRenderer,
        headerCheckbox: true,
        type:'boolean'
      },
      { 
        field: "learner_id", headerName: "STUDENT NO.",
        width: "120px",
        align: "left", 
        overflow: "ellipsis",
        headerClassName:'text-xs px-1',
        editable:false
      },
      { field: "STUDENT NAME",
        headerClassName:'text-xs p-1', 
        width:"160px",
        overflow: "ellipsis",
        align: "left", 
        sortable:true,
        editable:false,
      },
      { field: "SEX", 
        headerClassName:'text-xs p-1',
        align: "center",
        overflow: "ellipsis",
        width:'45px',
        valueFormatter:(value)=>value && value.toLowerCase()==='male'?'M':`F`,
        editable:false
      },
      { field: "STREAM", 
        headerClassName:'text-xs p-1', 
        overflow: "ellipsis",
        sortable:true,
        width:'70px',
        align: "center",
        editable:false
      },
      { field: "combination", 
        headerName:'COMBN',
        headerClassName:'text-xs p-1', 
        overflow: "ellipsis",
        sortable:true,
        align: "center",
        width:'100px',
        editable:false
      },
      { field: "num_subjects", 
        headerName:'SUBJ',
        headerClassName:'text-xs p-1', 
        overflow: "ellipsis",
        width:'50px',
        sortable:true,
        align: "center",
        editable:false
      },
      { field: "num_papers", 
        headerName:'PAPER',
        headerClassName:'text-xs p-1',
        overflow: "ellipsis",
        sortable:true,
        align: "center",
        editable:false
      },
      { field: "total_points", 
        headerName:'PNT',
        headerClassName:'text-xs p-1',
        overflow: "ellipsis",
        width:'50px',
        sortable:true,
        align: "center",
        editable:false,
        type:'number'
      },
      { field: "PSN_IN_STREAM", 
        headerName:'SPSN',
        headerClassName:'text-xs p-1', 
        overflow: "ellipsis",
        sortable:true,
        align: "center",
        editable:false,
        filterable:true,
        type:'number'
      },
      { field: "PSN", 
        headerName:'PSN',
        headerClassName:'text-xs p-1',
        overflow: "ellipsis",
        sortable:true,
        align: "center",
        filterable:true,
        type:'number'
      },
      { field: "pay_code", 
        headerName:'CODE',
        headerClassName:'text-xs p-1',
        valueFormatter:(value)=>value || `-`,
        headerRenderer:codeRenderer,
        overflow: "ellipsis",
        align: "center",
      },
      { 
        field: 'id', 
        headerName: "ACTION",
        headerClassName:'text-xs p-1',
        cellRenderer:linkRenderer,
        align: "center",
      },
  ]

  return (
    <div className="p-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="w-full hidden print:block print:-mt-2">
        <HeadedPaper/>
        <Title text={`${selected_clas } ${exam[set_time.exam]} ${roman_term[set_time.term]} SAMMURY`}/>
      </div>
      <div
        className="border-b flex gap-4 p-2 py-3 text-white"
        style={{ backgroundColor: theme_bg }}
      >
        <h2 className="text-sm font-bold">
          Class Size{" "}
          <span
            style={{ backgroundColor: colors.lighter_40 }}
            className="mt-1 text-xs py-1 px-2 rounded text-white"
          >
            {transformed_data?.length}{" "}
          </span>
        </h2>
        
        <button
          className="px-2 py-0 text-xs text-center print:hidden"
          style={{ backgroundColor: colors.lighter_30 }}
        >
          {selected_student?.length} selected
        </button>
      </div>
      {/* Header */}
      <DataGrid
        columns={columns}
        rows={transformed_data || []}//
        getRowId={(r) => r.id}
        className="shadow-none rounded-md"
        searchable
        searchPlaceholder="Seach students ..."
        emptyMessage="No Data Yet..."
        toolbar={toolBarOptions()}
        stickyHeader
        
        loading={loading}
        loadingRows={12}
        onViewChange={({filteredRows})=>dispatch({ type: "DATA_CHUNK", payload: filteredRows })}
          
        // showToolbar={true}  
        // theme="ocean"
        triped
        stripeColors={['#fff', colors.lighter_90]}
        rowClassName={({id, num_subjects, total_points})=>{
          return `${selected_student.includes(id)?'bg-green-100':null} 
          ${!painted && num_subjects!==5?'text-red-500':''} 
          ${(painted && total_points<7 )?'text-red-500':(painted && total_points>13?'text-green-500':'')}`}
        }
        
          classNames={{
          search: "rounded-md border-slate-300 px-1 py-1 focus:border-slate-800",
          row: "font-mono",
          footer: "bg-slate-800 text-slate-100",
          toolbar: "px-4 py-3 print:hidden",
          table:'min-w-[1000px] md:min-w-full',
          cell: "py-2 h-full", // styling the cell
          pageButton: "rounded-fulll font-bold bg-white text-black hover:bg-red-600",
        }}
        styles={{
          toolbar:{background:colors.lighter_90},
          headerCell:{background:'#fff',borderBottom:`2px solid ${theme_bg}`, color:theme_bg, fontWeight:700},
          cell:{borderBottom:`1px solid ${colors.lighter_70}`}
        }}/>
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
