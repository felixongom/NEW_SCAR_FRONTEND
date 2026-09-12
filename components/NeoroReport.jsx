'use client'

import { Document, Page, StyleSheet, Text} from "@react-pdf/renderer"
import _Neoro from "./Report/_Neoro"
import ReportCardLayout from "./Report/ReportCardLayout"
import AReportCardLayout from "./Report/AReportCardLayout"
import { convertSchoolInfoToObject } from "@/utils/reshpe_data"
import AOneReport from "@/components/Report/AOneReport"
function NeoroReport({data}) {  
    const styles = StyleSheet.create({
      page: {
        padding: "10",
        fontSize: 10,
      },
      container: {
        flexDirection: "row",
        border: "2 solid black",
        height: "100%",
        width: "100%",
      },
      blurBorder: {
        height: "100%",
        width: "100%",
        border: "4 solid gray",
        padding: "3",
      },
    });
    data.info = convertSchoolInfoToObject(data.school_info)
    // let logo = "http://localhost:3000/logo.png"
    
  return (
    <Document>
      {data?.data_chunk?.map((report, i) => (
    
        <Page key={i} size="Letter" style={[styles.page,{position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}]} >
           {(data.selected_clas === 'SENIOR 5' || data.selected_clas === 'SENIOR 6')?
           <AReportCardLayout report={report} data={data}>
            <AOneReport report={report}/>
           </AReportCardLayout>:
           <ReportCardLayout report={report} data={data}>
            <_Neoro subjects={report?.subjects}/>
          </ReportCardLayout>
           }  
          
        </Page>
      ))}
    </Document>
  )
}

export default NeoroReport
