import React from "react";
import XLSX from "xlsx-js-style";
import _ from "lodash";
import { useDataContext } from "@/context/DataProvider";

export default function ExportPaycode({ selected_student }) {
  const {transformed_data, selected_clas,theme_bg, set_time} = useDataContext()
  // filter selected learners only
  const filtered = _.filter( transformed_data, ({id})=>selected_student.includes(id))
  const data = filtered.length>0?filtered:transformed_data
  

  const handleExport = () => {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "ID",
      "LEARNER ID",
      "LEARNER'S NAME",
      "STREAM",
      "PAY CODE"
    ];

    const aoa = [headers];

    data.forEach((item) => {
      aoa.push([
        item.id ?? "",
        item.learner_id ?? "",
        item["STUDENT NAME"] ?? "",
        item.STREAM ?? "",
        item.pay_code ?? ""
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Header style
    headers.forEach((header, columnIndex) => {
      const address = XLSX.utils.encode_cell({
        r: 0,
        c: columnIndex
      });

      ws[address].s = {
        font: {
          bold: true,
          sz: 12,
          color: {
            rgb: "FFFFFF"
          }
        },
        fill: {
          fgColor: {
            rgb: theme_bg.replace('#','')
          }
        },
        alignment: {
          horizontal: "center",
          vertical: "center"
        },
        border: {
          top: {
            style: "thin",
            color: { rgb: "FFFFFF" }
          },
          bottom: {
            style: "thin",
            color: { rgb: "FFFFFF" }
          },
          left: {
            style: "thin",
            color: { rgb: "FFFFFF" }
          },
          right: {
            style: "thin",
            color: { rgb: "FFFFFF" }
          }
        }
      };
    });

    // Data style - font size 13
    for (let r = 1; r < aoa.length; r++) {
      for (let c = 0; c < headers.length; c++) {

        const address = XLSX.utils.encode_cell({
          r,
          c
        });

        if (ws[address]) {
          ws[address].s = {
            font: {
              sz: 12
            },
            alignment: {
              horizontal: (c===1 || c === 2) ? "left" : "center",
              vertical: "center"
            }
          };
        }
      }
    }

    // Column widths
    // ID column is hidden
    ws["!cols"] = [
      {
        hidden: true,
        wch: 15
      },
      {
        wch: 25
      },
      {
        wch: 35
      },
      {
        wch: 15
      },
      {
        wch: 20
      }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "PAY CODES"
    );

    // Export
    XLSX.writeFile(
      wb,
      `${selected_clas}_${set_time.year}_TERM_${set_time.term}_PAY_CODES.xlsx`
    );
  };

  return (
    <button
      onClick={handleExport}
      className="rounded-md px-2 py-2 hover:px-4 text-xs md:text-sm bg-slate-700 hover:bg-green-600 text-white transition-all duration-200"
    >
      CLICK HERE TO EXPORT PAY CODE - {data?.length}
    </button>
  );
}