'use client'

import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { Grade, Header, HolderInfo, HorizontalLine, Remarks } from "./ReportElement"
import MidStandardReport from "./Report/MidStandard"
import OverallAchivement from "./OverallAchivement"
import { useDataContext } from "@/context/DataProvider"

function StandardReport() {
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
   let {logo} = useDataContext()
   
   let reports = [1, 2, 3, 4];
   let school_logo = logo.length===0?"http://localhost:3000/logo.png":logo
  return (
    <Document>
      {reports.map((reports, i) => (
        <Page key={i} size="A4" style={[styles.page,{position:'relative', display:'flex', alignItems:'center', justifyContent:"center", flexDirection:"column"}]} >
          <Image source={school_logo} style={{height:500, width:500, position:'absolute', opacity:.08}}/>            
          <View style={styles.container}>
            <View style={[styles.blurBorder, {display:'flex', alignItems:'center', justifyContent:"space-between", flexDirection:"column"}]}>
              <Header show_photo={true}/>
              <HorizontalLine color={null}/>
              <Text style={{textAlign:'center', color:'blue', fontWeight:'bold', textTransform:'capitalize', marginBottom:'15'}}>Mid Term Exams</Text>
              <HolderInfo/>
              <MidStandardReport/> 
              <OverallAchivement/>
              <Remarks/>
              <Grade/>
              <Text style={{padding:'5', textAlign:'center'}}>AOI: Average Of Activity of Integration, EOA: End of Assesment</Text>
              </View>
            </View>
        </Page>
      ))}
    </Document>
  )
}

export default StandardReport
