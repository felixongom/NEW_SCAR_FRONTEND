"use client";

import {Document,Image,Page,StyleSheet,Text,View} from "@react-pdf/renderer";
import {AGrade, Header,HorizontalLine,InfoCenterValue,InfoValue} from "./ReportElement";

import { Table, TD, TR } from "@ag-media/react-pdf-table";
import { chunkArray, sortObjectWithGpIct } from "@/utils/";
import { convertSchoolInfoToObject } from "@/utils/reshpe_data";
import {brightness} from 'color-tin'
import { term } from "@/utils/reportList";
import {colorTin} from 'color-tin'

function AClassGrade({is_marks,hide_grade=false, data}) {
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

  let {transformed_data,paper_mode,selected_clas, theme_bg, num_per_stream, grade_range } = data

  let perpage = paper_mode==='portrait'?50:35
  let firstpage = paper_mode==='portrait'?42:28
  let reports = chunkArray(transformed_data?transformed_data:[], perpage, firstpage);
  data.info = convertSchoolInfoToObject(data.school_info)
  //
  let streams = Object.keys(num_per_stream?.streams).join(' , ')
   let colors = colorTin(theme_bg, 10)
    
  return (
    <Document>
      {reports?.map((report, chunk_i) => (
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
                <Header data={data} logo={data.logo} show_photo={false} summary={true} headerLandscape={{height: "16%"}} />
                <HorizontalLine color={data.theme_bg}/>
                <Table style={{ border: "0", marginBottom: 5 }}>
                  <TR>
                    <TD style={{ flex: 1 }}>Class:</TD>
                    <TD style={{ flex: 2 }}>{selected_clas}</TD>
                    <TD style={{ flex: 1 }}>Year:</TD>
                    <TD style={{ flex: 4 }}>{data?.set_time.year}</TD>
                    <TD style={{ flex: 4 }}>
                      <Text
                        style={{
                          textAlign: "center",
                          color: data.theme_bg,
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      >
                        {term[data.set_time.exam]}
                      </Text>
                    </TD>
                    <TD style={{ flex: 1 }}>Term:</TD>
                    <TD style={{ flex: 2, textTransform:'uppercase'}}>{data?.set_time.term}</TD>
                    <TD style={{ flex: 1 }}>Stream:</TD>
                    <TD style={{ flex: 3 }}>{streams}</TD>
                  </TR>
                </Table>
              </>
              )}
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
                  <Text style={{width: "3%", paddingLeft: "4" }}>#</Text>
                  <Text style={{ width: "26%", paddingLeft: "4" }}>
                    LEARNER'S NAME
                  </Text>
                  <Text
                    style={{
                      width: "10",
                      textAlign: "center",
                    }}
                    >
                    STREAM
                  </Text>
                  <Text
                    style={{
                      flex:1,
                      textAlign: "center",
                    }}
                  >
                    GRADE
                  </Text>
                </View>
              {/* students listed here */}
              {report?.map((stud, i) => { 
                let all_my_subjects = sortObjectWithGpIct(stud.grade_per_subject);
                
                //  
                return (
                  <View
                    key={i}
                    style={{
                    display: "flex",
                    paddingTop: "3",
                    flexDirection: "row",
                    backgroundColor: i % 2 === 1 ?  colors.lighter_80  : "#fff",
                    height:'19',
                    fontSize:'8',
                    borderColor:colors.lighter_70,
                    borderBottomWidth:1
                  }}
                >
                  <Text style={{width:'3%'}}>{`${((perpage*chunk_i)+i)+1 +(chunk_i>0? (firstpage - perpage):0)}`}</Text>
                  <Text style={{ width:'24%', display:'flex', justifyContent:"flex-start",}} >
                    <InfoValue text={stud['STUDENT NAME']} /> 
                  </Text>
                  <Text style={{ width:'9%', display:'flex', justifyContent:"flex-start"}} >
                    <InfoCenterValue text={stud['STREAM']} />
                  </Text>
                  <Text style={{ width:'9%', display:'flex', justifyContent:"flex-start", marginRight:'20'}} >
                    <InfoCenterValue text={stud['combination']} />
                  </Text>
                  {Object.keys(all_my_subjects).map(one_subject=>(
                    hide_grade?(
                    <Text style={{flex:1,gap:5, justifyContent:'space-between', display:'flex'}} >
                    <InfoValue text={`${one_subject} ${is_marks?" - ( "+all_my_subjects[one_subject].grade.join(',')+" )":''}`} />
                  </Text>):(
                    <Text style={{flex:1,gap:5, justifyContent:'space-between', display:'flex'}} >
                    <InfoValue text={`${one_subject} - ${all_my_subjects[one_subject].letter}${is_marks?" - ( "+all_my_subjects[one_subject].grade.join(',')+" )":''}`} />
                  </Text>                   
                    )
                  
                  ))}
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
        <Page
          orientation={paper_mode}
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
              <Header data={data} logo={data.logo} show_photo={false} summary={true} headerLandscape={{height: paper_mode==='portrait'?"13%":"16.5%"}} />
              <HorizontalLine color={data.theme_bg}/>
              <Table style={{ border: "0", marginBottom: 5 }}>
                <TR>
                  <TD style={{ flex: 1 }}>Class:</TD>
                  <TD style={{ flex: 2 }}>{selected_clas}</TD>
                  <TD style={{ flex: 1 }}>Year:</TD>
                  <TD style={{ flex: 4 }}>{data?.set_time.year}</TD>
                  <TD style={{ flex: 4 }}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: data.theme_bg,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {term[data.set_time.exam]}
                    </Text>
                  </TD>
                  <TD style={{ flex: 1 }}>Term:</TD>
                  <TD style={{ flex: 2, textTransform:'uppercase'}}>{data?.set_time.term}</TD>
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
                <Text style={{ width: "100%"}}>
                 <InfoCenterValue text={'GRADINGS'}/>
                </Text>
              </View>

              <AGrade sub_group={"PRINCIPAL"} grade_range={grade_range.grade}/>
              <AGrade sub_group={"SUBSIDIARY"} grade_range={grade_range.subsidiary_grade}/>
            
              
             <View style={{position:'absolute',bottom:'-3', width:'100%'}}>
                <HorizontalLine margin_bottom={'0'} color={data.theme_bg} />
              </View>
            </View>
          </View>
           <Image src={data.main_school_info?.logo} style={{height:500, width:500, position:'absolute', opacity:.1}}/>
        </Page>
    </Document>
  );
}

export default AClassGrade;
