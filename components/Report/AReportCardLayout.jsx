import { StyleSheet, Text, View, Image } from '@react-pdf/renderer'
import { AGrade, Header, AHolderInfo, HorizontalLine, ARemarks } from "../ReportElement"
import { exam, getPhotoByName} from '@/utils/reportList';

function AReportCardLayout({children, report, data}) {
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
            display:'flex',
            alignItems:'center',
            justifyContent:'space-between',
            flexDirection:'column'
            
          },
        });
    let {photos, grade_range} = data
    let school_logo = data?.info?.logo
    report.expexted_total = report['NUM SUBJ']*100
    let picture = getPhotoByName(photos, report['STUDENT NAME'])  
     
     
        
    
    return (
    <>
        <Image src={school_logo} style={{height:500, width:500, position:'absolute', opacity:.08}}/>
        <View style={styles.container}>
          <View style={styles.blurBorder}>
            <Header show_photo={true} logo ={school_logo} picture={picture||report.image} data={data}/>
            <HorizontalLine color={data.theme_bg}/>
            <View style={{position:'relative',width:'100%',marginBottom:'20'}}>
              <Text style={{textAlign:'right', color:'#e60000', width:'100%', fontSize:11}}>{report['learner_id']}</Text>
              <Text style={{textAlign:'center', textTransform:'uppercase',fontSize:12, position:'absolute', color:'blue', fontWeight:'bold', textTransform:'capitalize', marginTop:'5', width:'100%'}}>{!data.set_time.exam.includes('&')?exam[data.set_time.exam]:exam[data.set_time.exam.split('&').reverse()[0].trim()].toUpperCase()} REPORT</Text>
            </View>
            <AHolderInfo report={report} data={data}/>
            {children}
            <ARemarks
              num_per_stream={data?.num_per_stream} 
              report={report} 
              info={data?.info}
              put_position={data?.put_position} 
              begins={data?.begins}
              ends={data.ends}/>
              
              
            <AGrade sub_group={"PRINCIPLE"} grade_range={grade_range.grade}/>
            <AGrade sub_group={"SUBSIDIARY"} grade_range={grade_range.subsidiary_grade}/>
            <Text style={{padding:'5',marginTop:'10', textAlign:'center', fontSize:'9', fontStyle:'italic'}}>COMBN: Subject Combination, MOT: Mid of Term, EOT: End of Term, AVG: Average</Text>
          </View>
        </View>
    </>
  )
}

export default AReportCardLayout