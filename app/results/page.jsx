"use client";
import SideMenu from "@/components/Avance/SideMenu";
import ExcelUploader from "@/components/ExcelUploader";
import EnroledStudentList from "@/components/Avance/EnroledStudentList"

export default function AoneClass() {
  
  return (
    <div className="bg-gray-200 w-full h-[100vh] flex">
      <SideMenu />
      <div className="flex-1 pl-1">
        <ExcelUploader level="A" />
        <div className="ag-theme-quartz flex-1" style={{ height: 100, width: "100%" }}>
            <EnroledStudentList/>
        </div>
      </div>
    </div>
  );
}
