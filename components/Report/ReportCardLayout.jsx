import { StyleSheet, Text, View, Image } from '@react-pdf/renderer'
// import Image from 'next/image'
import { Grade, Header, HolderInfo, HorizontalLine, Remarks } from "../ReportElement"
import OverallAchivement from "../OverallAchivement"
import { getPhotoByName } from '@/utils/reportList';


function ReportCardLayout({children, report, data}) {
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
            position:'positive'
          },
        });
    let {photos, grade_range} = data
    report.expexted_total = report['NUM SUBJ']*100
    let picture = getPhotoByName(photos, report['STUDENT NAME'])    
    let is_aoi = data?.pathname?.split('/').reverse()[0]==='aoi';
    
    
  return (
    <>
        <Image src={data.main_school_info?.logo} style={{height:500, width:500, position:'absolute', opacity:.1}}/>
        <View style={styles.container}>
          <View style={styles.blurBorder}>
            <Header show_photo={true} logo ={data.main_school_info?.logo} picture={picture} data={data}/>
            <HorizontalLine color={data.theme_bg}/>
            <View style={{position:'relative'}}>
              <Text style={{ textAlign:'center', color:'blue', fontWeight:'bold', textTransform:'capitalize', marginBottom:'10', marginTop:'5', width:'100%'}}>{data?.info['EXAMS']?.toUpperCase()}</Text>
              <Text style={{textAlign:'right', color:'#e60000', width:'100%', fontSize:13, position:'absolute', }}>{report['STD NO']}</Text>
            </View>
            <HolderInfo report={report} data={data}/>
            {children}
            <OverallAchivement is_aoi={is_aoi} report={report}/>
            <Remarks selected_clas={parseInt(data.selected_clas.split(' ')[1])} num_per_stream={data?.num_per_stream} report={report} info={data?.info}/>
            <Grade grade_range={grade_range}/>
            <Text style={{padding:'5', textAlign:'center', fontSize:'9', fontStyle:'italic'}}>AOI: Average Of Activity of Integration,C1: Chapter 1,BOT: Begining of Term,MOT: Mid Term, EOT: End of Term, AVG: Average</Text>
          </View>
        </View>
    </>
  )
}

export default ReportCardLayout