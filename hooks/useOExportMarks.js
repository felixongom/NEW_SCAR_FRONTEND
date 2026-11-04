// ExportToExcel.jsx
import React from "react";
import XLSX from "xlsx-js-style";
import { a_subject_full_name, exam_by_id } from "@/utils/reportList";
import {brightness} from "color-tin"

export default function OExportToExcel({ data = [], theme_bg, selected_exam_category }) {  
  if( data.length==0 || selected_exam_category.length==0 ) return
  
  let header_fill_color = theme_bg.split('#')[1] 
  
  const exam_short_name = {1:'BOT', 2:'MOT', 3:'EOT'} 
  data = _.orderBy(data, ['stream','learner'], ['asc','asc'])
  
  const handleExport = () => {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No data to export");
      return;
    }

    // Assume single subject export; get first paper as filename
    const firstItem = data[0];

    //aoi key 
    const aoiKeys = selected_exam_category?.filter(aoi=>aoi.startsWith('aoi')) //aoi key 
    const aoiLabels = aoiKeys.map((aoi_key) => `A${aoi_key.split('_')[1]}(X/20)`);
    
    // 
    const paperKeys = selected_exam_category.filter(mark_key=>mark_key.startsWith('marks'))
                      .map(marks=>'paper_'+ marks?.split('_')[1]); //paper key
    const paperLabels = paperKeys.map((k) => `${firstItem.papers[k]}(X/80)`);

    // Determine subject name for filename
    const subjectName = data[0]?.papers?.paper_1?.split(" ")[0]; // e.g., 'PHY' from 'PHY 1'
    
    // =====================
    // MAIN DATA SHEET
    // =====================
    const headers = ["MARKS_ID", "LEARNER'S NAME", 'STREAM', ...aoiLabels, ...paperLabels.map((l) => l.toUpperCase())];
    const aoa = [headers];

    data.forEach((item) => {
      const row = [];
      // join all marks_id values into comma-separated string
      const aoiIdStr = aoiKeys.map(aoi_key=>item.aoi_id[aoi_key]).join(",");
      const marksIdStr = selected_exam_category.filter(mark_key=>mark_key.startsWith('marks'))
                        .map(mark_key =>item.marks_id[mark_key])
                             

      row.push(aoiIdStr+(marksIdStr?',':'')+marksIdStr); // AOI_ID and MARKS_ID (hidden column)
      row.push(item.learner ?? ""); // learner name
      row.push(item.stream ?? ""); // learner stream
      
      aoiKeys.forEach((pk) => {
        const val = item.aoi_marks?.[pk] ?? "";
        row.push(val);
      });
      // 
      paperKeys.forEach((pk) => {
        const val = item.marks?.[pk] ?? "";
        row.push(val);
      });
      aoa.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);    

    // Style header row
    headers.forEach((h, c) => {
      const addr = XLSX.utils.encode_cell({ r: 0, c });
      if (!ws[addr]) ws[addr] = { t: "s", v: h };
      ws[addr].s = {
        font: { bold: true,sz: 12, color: { rgb: (brightness(theme_bg)<65?"ffffff":'0000000') } },
        fill: { fgColor: { rgb: header_fill_color || "BC234F" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "f2f2f2" } },
          bottom: { style: "thin", color: { rgb: "f2f2f2" } },
          left: { style: "thin", color: { rgb: "f2f2f2" } },
          right: { style: "thin", color: { rgb: "f2f2f2" } },
        },
      };
    });

    // Style marks center-aligned
    for (let r = 1; r < aoa.length; r++) {
      for (let c = 2; c < headers.length; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (ws[addr]) {
          ws[addr].s = { alignment: { horizontal: "center", vertical: "center" } };
        }
      }
    }

    // Column widths
    ws["!cols"] = headers.map((_, i) => {
      if (i === 0) return { hidden: true, wch: 15 }; // Hide MARKS_ID
      if (i === 1) return { wch: 40 }; // Learner column wider
      return { wch: 15 }; // Marks columns
    });

    // =====================
    // INFO SHEET
    // =====================
    const infoHeaders = ["ATTRIBUTE", "VALUE"];
    const infoData = [
      ["YEAR", firstItem.year],
      ["TERM", firstItem.term],
      ["CLASS", firstItem.clas],
      ["EXAM", exam_by_id[firstItem.exam]],
    ];

    const infoAOA = [infoHeaders, ...infoData];
    const infoWS = XLSX.utils.aoa_to_sheet(infoAOA);

    // Style info header row
    infoHeaders.forEach((h, c) => {
      const addr = XLSX.utils.encode_cell({ r: 0, c });
      if (!infoWS[addr]) infoWS[addr] = { t: "s", v: h };
      infoWS[addr].s = {
        font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } }, // Blue background
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    });

    // Style info data rows
    for (let r = 1; r < infoAOA.length; r++) {
      for (let c = 0; c < infoHeaders.length; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        if (infoWS[addr]) {
          infoWS[addr].s = {
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      }
    }

    // Column widths
    infoWS["!cols"] = [
      { wch: 15 }, // ATTRIBUTE
      { wch: 20 }, // VALUE
    ];

    // =====================
    // WORKBOOK
    // =====================
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MARKS"); // Main sheet
    XLSX.utils.book_append_sheet(wb, infoWS, "INFO"); // Info sheet

    // Save workbook with subject name
    let surfix = `${firstItem.year}_TERM_${firstItem.term}_SENIOR_${firstItem.clas}_${exam_short_name[firstItem.exam]}`
    XLSX.writeFile(wb, `${a_subject_full_name[subjectName] || subjectName}_${surfix}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="px-2 py-2 bg-blue-600 text-white rounded w-full"
      style={{backgroundColor:theme_bg}}
    >
      Export Excel
    </button>
  );
}
