"use client";

import {Document,Image,Page,StyleSheet,Text,View} from "@react-pdf/renderer";
import {Header,HorizontalLine,InfoCenterValue,InfoValue,} from "./ReportElement";
import { Table, TD, TR } from "@ag-media/react-pdf-table";
import { numbersArray, chunkArray } from "@/utils/";
import { convertSchoolInfoToObject } from "@/utils/reshpe_data";
import { subject_full_name } from "@/utils/reportList";
import {brightness} from 'color-tin' 
import _ from 'lodash' 


function MarkSheet({data, result,subject}) {
  
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
      height: "10%",
    },
  });
  let {selected_clas, num_per_stream, theme_bg} = data
  // 
  let firstpage = 38
  let perpage = 43
  let reports = chunkArray(result, perpage, firstpage);
  data.info = data.school_info 
  // 

  
  let list_header = ['C1(3)', 'C2(3)', 'EXAM1 (80)', 'EXAM2 (80)'];
  data.info = convertSchoolInfoToObject(data.school_info)
  subject = subject.toUpperCase()
  let streams = Object.keys(num_per_stream?.streams).sort().join(' , ')
  
  
  return (
    <Document>
      {reports.map((report, chunk_i) => (
        <Page
          key={chunk_i}
          size="Letter"
          style={[
            styles.page,
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
              {chunk_i==0 && (
              <>
              <Header subject={subject.toUpperCase()} show_photo={false} data={data} headerLandscape={{}}/>
              <HorizontalLine color={data.theme_bg}/>

              <Table style={{ border: "0", marginBottom: 5 }}>
                <TR>
                  <TD style={{ flex: 1 }}>Class:</TD>
                  <TD style={{ flex: 2 }}>{selected_clas}</TD>
                  <TD style={{ flex: 1 }}>Year:</TD>
                  <TD style={{ flex: 2 }}>{data?.info['YEAR']}</TD>
                  <TD style={{ flex: 4 }}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "blue",
                        fontWeight: "bold",
                        textTransform: "capitalize", 
                      }}
                    >
                       {subject_full_name[subject] ||subject}
                    </Text>
                  </TD>
                  <TD style={{ flex: 1 }}>Term:</TD>
                  <TD style={{ flex: 1 }}>{data?.info['TERM']}</TD>
                  <TD style={{ flex: 1 }}>Stream: </TD>
                  <TD style={{ flex: 2 }}> {streams}</TD>
                </TR>
              </Table>
              </>)}
              <View
                style={{
                  display: "flex",
                  paddingTop: "4",
                  paddingBottom: "4",
                  flexDirection: "row",
                  width: "100%",
                  fontWeight: "bold",
                  backgroundColor:data.theme_bg,
                  color:brightness(data.theme_bg)<65?"white":'black'
                }}
                >
                
                <Text style={{ width:'40%', paddingLeft: "4",fontSize:'12', paddingBottom:1 }}>
                  LEARNER
                </Text>
                <Text
                    style={{
                      width: "10%",
                      textAlign: "center",
                      fontSize:'12'
                    }}
                  >
                    STREAM
                  </Text>
                <Text
                  style={{
                    flex: 3,
                    width: "100%",
                    fontSize:'12',
                    paddingLeft:'5'
                  }}
                >
                  PROGRESSIVE SCORE
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  paddingTop: "4",
                  paddingBottom: "4",
                  flexDirection: "row",
                  width: "100%",
                  fontWeight: "bold",
                  color:data.theme_bg,
                }}
                >
                <Text style={{width: "5%"}}>#</Text>
                <Text
                  style={{
                    width: "35%",
                    height:'100%',
                    textTransform: "uppercase",
                    backgroundColor:data.theme_bg
                  }}
                />
                <Text
                  style={{
                    width: "10%",
                    height:'100%',
                    textTransform: "uppercase",
                  }}
                />
                {list_header.map((subj, i) => (
                  <Text key={i} style={{ flex: 1 }}>
                    <InfoCenterValue text={`${subj}`} />
                  </Text>
                ))}
              </View>
              {report.map((stud, i) => (
                <View
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    display:'flex',
                    alignItems:'center',
                    width: "100%",
                    height:'20',
                    borderBottom:'1',
                    backgroundColor: i % 2 === 0 ? "#f2f2f2" : "#fff",
                    
                  }}
                >
                  <Text style={{width: "5%", paddingLeft: "0",fontSize:9 }}>{`${((perpage*chunk_i)+i)+1 +(chunk_i>0? (firstpage - perpage):0)}`}</Text>
                  <Text
                    style={{
                      width: "35%",
                      textTransform: "uppercase",
                      fontSize:9,
                    }}
                  >
                    <InfoValue text={stud['STUDENT NAME']} />
                  </Text>
                  <Text
                    style={{
                      width: "10%",
                      textAlign: "center",
                      borderRight:'1',
                    }}
                  >
                    <InfoCenterValue text={stud['STREAM']} />
                  </Text>
                  {numbersArray(list_header.length).map((subj, i) => (
                    <Text key={i} style={{ flex: 1,borderRight:'1', height:'100%', width:'100%',paddingTop: "4",paddingBottom: "4", backgroundColor:i==0?'#ffffb3':i==1?'#ccffcc':i==2?'#ffe6e6':'#e6f7ff',fontSize:9 }}>
                      <InfoCenterValue text={""} />
                    </Text>
                  ))}
                </View>
              ))}
              <HorizontalLine color={theme_bg} />
            </View>
          </View>
          <Image src={data.main_school_info?.logo} style={{height:500, width:500, position:'absolute', opacity:.1}}/>

        </Page>
      ))}
    </Document>
  );
}
export default MarkSheet;
