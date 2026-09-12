'use client'

import { Document, Page, StyleSheet} from "@react-pdf/renderer"
import Standard from "./Report/Standard"
import ReportCardLayout from "./Report/ReportCardLayout"
import AReportCardLayout from "./Report/AReportCardLayout"
import AOneDenseReport from "./Report/AOneDenseReport"

function StandardReport({data}) {
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
    
  return (
    <Document>
      {data?.data_chunk?.map((report, i) => (
        <Page key={i} size="Letter" style={[styles.page,{position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}]} >
          {(data.selected_clas === 'SENIOR 5' || data.selected_clas === 'SENIOR 6')?
            <AReportCardLayout report={report} data={data}>
              <AOneDenseReport report={report} set_time={data.set_time}/>
            </AReportCardLayout>:
            <ReportCardLayout report={report} data={data}>
              <Standard subjects={report?.subjects}/> 
            </ReportCardLayout>
            }  
        </Page>
      ))}
    </Document>
  )
}

export default StandardReport
