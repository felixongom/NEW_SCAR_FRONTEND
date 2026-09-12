"use client";

import {Document,Image,Page,StyleSheet,Text,View} from "@react-pdf/renderer";
import {Header,HorizontalLine,InfoCenterValue,InfoValue} from "./ReportElement";

import { Table, TD, TR } from "@ag-media/react-pdf-table";
import { chunkArray, roundOff } from "@/utils/";
import {brightness} from 'color-tin'  
import {colorTin} from 'color-tin'

function ClassGrade({is_marks, data}) {
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

  let {transformed_data,paper_mode,selected_clas,selected_exam,theme_bg, num_per_stream, my_subjecs } = data
  // redirect
  let sublength = transformed_data[0]?.subjects?.length;
  let perpage = paper_mode==='portrait'?50:35
  let firstpage = paper_mode==='portrait'?42:28
  let reports = chunkArray(transformed_data?transformed_data:[], perpage, firstpage);
  data.info = data.school_info
  // 
  let streams = Object.keys(num_per_stream?.streams).join(' , ')
   let colors = colorTin(theme_bg, 10)
  
  
  return (
    <Document>
      {reports.map((report, chunk_i) => (
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
              {chunk_i==0 && (
                <>
                  <Header data={data} show_photo={false} summary={true} headerLandscape={{height: paper_mode==='portrait'?"13%":"16.5%"}} />
                  <HorizontalLine color={data.theme_bg}/>
                  <Table style={{ border: "0", marginBottom: 5 }}>
                    <TR>
                      <TD style={{ flex: 1 }}>Class:</TD>
                      <TD style={{ flex: 2 }}>{selected_clas}</TD>
                      <TD style={{ flex: 1 }}>Year:</TD>
                      <TD style={{ flex: 4 }}>{data?.info['YEAR']}</TD>
                      <TD style={{ flex: 4 }}>
                        <Text
                          style={{
                            textAlign: "center",
                            color: data.theme_bg,
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          {data.info['EXAMS']}
                        </Text>
                      </TD>
                      <TD style={{ flex: 1 }}>Term:</TD>
                      <TD style={{ flex: 2, textTransform:'uppercase'}}>{data?.info['TERM'].toUpperCase()}</TD>
                      <TD style={{ flex: 1 }}>Stream:</TD>
                      <TD style={{ flex: 3 }}>{streams}</TD>
                    </TR>
                  </Table>
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
                      color:brightness(data.theme_bg)<65?"white":'black'
                    }}
                  >
                    <Text style={{width: "3%", paddingLeft: "4" }}>#</Text>
                    <Text style={{ width: "30%", paddingLeft: "4" }}>
                      LEARNER'S NAME
                    </Text>
                    <Text
                      style={{
                        flex: sublength,
                        width: "50%",
                        textAlign: "center",
                      }}
                    >
                      PROGRESSIVE SCORE
                    </Text>
                  </View>
                </>
              )}

              <View
                style={{
                  display: "flex",
                  paddingTop: "2",
                  paddingBottom: "2",
                  flexDirection: "row",
                  width: "100%",
                  fontWeight: "bold",
                  color:data.theme_bg,
                  fontSize:'8',
                  borderColor:'#66ccff'
                }}
              >
                <Text
                  style={{
                    width: "18.5%",
                    textTransform: "uppercase",
                    backgroundColor: chunk_i>0?'#fff': data.theme_bg,
                  }}
                > {chunk_i >0 && "LEARNER'S NAME"} </Text>
                {/* horizontal list of subjects */}
                {[...my_subjecs,"AVG"]?.map((subj, i) => (
                  subj!=='*' && (<Text key={i} style={{ flex: 1 }}>
                    <InfoCenterValue text={subj} />
                  </Text>)
                  
                ))}
              </View>
              {/* students listed here */}
              {report?.map((stud, i) => {                
                return (
                  <View
                    key={i}
                    style={{
                    display: "flex",
                    paddingTop: "4",
                    paddingBottom: "2",
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor: i % 2 === 1 ?  colors.lighter_80  : "#fff",
                    height:'19',
                    fontSize:'8',
                    borderColor:colors.lighter_70,
                    borderBottomWidth:1,
                  }}
                >
                  <Text style={{width: "3.5%", paddingLeft: "6"}}>{`${((perpage*chunk_i)+i)+1 +(chunk_i>0? (firstpage - perpage):0)}`}</Text>
                  <Text
                    style={{
                      flex: 3,
                      width: "35%",
                      textTransform: "uppercase",
                    }}
                  >
                    <InfoValue text={stud['STUDENT NAME']} />
                  </Text>
                  {stud?.subjects?.map((subj, i) => {
                    let cell_value = '-'
                    if(selected_exam==='Aoi'){
                      cell_value = is_marks?roundOff(subj['AOI(100)'],0):subj['MID GRADE']
                    }else if(selected_exam==='Exam'){
                      cell_value = is_marks?roundOff(subj['EOA(80)'],0):subj['EOA GRADE']

                    }
                    else{
                      cell_value = is_marks?roundOff(subj['TOTAL'],0):subj['GRADE']

                    }
                    // 
                    return(
                      <Text key={i} style={{ flex: 1, fontSize:'8' }}>
                        <InfoCenterValue text={cell_value}/>
                      </Text>
                  )})}
                  <Text
                    style={{
                      flex: 1,
                      width: "35%",
                      textTransform: "uppercase",
                      fontSize:'8',
                    }}
                  >
                    <InfoCenterValue text={'-'/*is_marks?'-'roundOff(stud['AVG'],1):stud['AVG GRADE']*/} />
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
      ))}
    </Document>
  );
}

export default ClassGrade;
