"use client";

import {Document,Image,Page,StyleSheet,Text,View} from "@react-pdf/renderer";
import {HorizontalLine,InfoCenterValue,InfoValue, UnebHeader} from "../ReportElement";
import { brightness } from 'color-tin'
// 
function BestAndWorstUceGrade({data}){
  const styles = StyleSheet.create({
    page: {
      padding: "10",
      fontSize: 10,
    },
    container: {
      flexDirection: "row",
      border: "0",
      height: "100%",
      width: "100%",
    },
    blurBorder: {
      height: "100%",
      width: "100%",
      border: "0",
      padding: "3",
    },
    headerLandscape: {
      height: "17%",
    },
  });

  let { uneb_uce, paper_mode,theme, selected_clas } = data
  let reports = [uneb_uce?.BEST20, uneb_uce?.WORST20];
  data.info = { ...data.school_info, ...uneb_uce?.SCHOOL_INFO }
  //
    
  return (
    <Document>
      {reports?.map((report, chunk_i) => {        
        return(
        <Page
          orientation={paper_mode}
          key={chunk_i}
          size="Letter"
          style={[styles.page,
            {
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <View style={styles.container}>
            <View style={styles.blurBorder}>
              
                <UnebHeader data={data} headerLandscape={{height: "16%"}} />
                <HorizontalLine color={data.theme_bg}/>
                <Text style={{ marginBottom:3,fontWeight:'bold', textAlign:'center', color:theme?.bg, fontSize:14}}>{data?.info?.EXAM||selected_clas} - {data?.info?.YEAR} {chunk_i==0?"BEST":"WORST"} {report?.length} CANDIDATES</Text> 
            
                <View
                  style={{
                    display: "flex",
                    paddingTop: "4",
                    paddingBottom: "4",
                    flexDirection: "row",
                    width: "100%",
                    fontWeight: "bold",
                    backgroundColor: data.theme_bg,
                    height:'25',
                    fontSize:'8',
                    color:brightness(data.theme_bg)<65?"white":'black'
                  }}
                >
                  <Text style={{flex: 1,textAlign: "center", fontSize:'12'}}>
                    SCORES
                  </Text>
                </View>
              
                {/* subject heading */}
                <View
                style={{
                  display: "flex",
                  paddingTop: "2",
                  paddingBottom: "2",
                  flexDirection: "row",
                  width: "100%",
                  fontWeight: "bold",
                  color:data.theme_bg,
                  fontSize:'8'
                }}
              >
                <Text style={{width: "3%"}}>
                  <InfoValue text={'#'} />
                </Text>
                <Text style={{width: "7%"}}>
                  <InfoValue text={'INDEX NO'} />
                </Text>
                <Text style={{width: "20%"}}>
                  <InfoValue text={"LEARNER'S NAME"} />
                </Text>
                <Text style={{ flex: 1}}>
                  <InfoCenterValue text={"SEX"} />
                </Text>
                {/* horizontal list of subjects */}
                {[,...uneb_uce.SUBJECT_LIST,"PROJ",'RES']?.map((subj, i) => {
                  return(
                    <Text key={i} style={{ flex: 1 }}>
                      <InfoCenterValue text={subj} />
                    </Text>
                )})}
              </View>
              {/* students listed here */}
              {report?.map((stud, i) => { 
                //                  
                return (
                  <View
                    key={i}
                    style={{
                    display: "flex",
                    paddingTop: "3",
                    flexDirection: "row",
                    backgroundColor: i % 2 === 0 ? "#d9d9d9" : "#fff",
                    height:'19',
                    fontSize:'8',
                  }}
                >
                  <Text style={{width:'3%'}}>{i + 1}</Text>
                  <Text style={{ width:'7%', display:'flex', justifyContent:"flex-start",}} >
                    <InfoValue text={stud['INDEX NO']}/> 
                  </Text>
                  <Text style={{ width:'20%', display:'flex', justifyContent:"flex-start",}} >
                    <InfoValue text={stud['STUDENT NAME']}/> 
                  </Text>
                  <Text style={{ flex:1, display:'flex', justifyContent:"flex-start",}} >
                    <InfoCenterValue text={stud['SEX']}/> 
                  </Text>
                  {uneb_uce?.SUBJECT_LIST?.map(one_subject=>(
                    <Text style={{flex:1, justifyContent:'space-between', display:'flex'}} >
                      <InfoCenterValue text={stud?.SUBJECTS[one_subject]} />
                    </Text>
                  ))}
                  <Text style={{ flex:1, display:'flex', justifyContent:"flex-start"}} >
                    <InfoCenterValue text={stud['PROJECT WORK']}/> 
                  </Text>
                  <Text style={{ flex:1, display:'flex', justifyContent:"flex-start",}} >
                    <InfoCenterValue text={stud['RESULT']}/> 
                  </Text>
                </View> 
                )
              }
                
              )}
             <View style={{position:'absolute',bottom:'-3', width:'100%'}}>
                <HorizontalLine margin_bottom={'0'} color={data.theme_bg} />
              </View>
            </View>
          </View>
          <Image src={data.main_school_info?.logo} style={{height:500, width:500, position:'absolute', opacity:.1}}/>
        </Page>
      )})}
    </Document>
  );
}

export default BestAndWorstUceGrade;
