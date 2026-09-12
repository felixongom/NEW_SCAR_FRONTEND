"use client";

import {Document,Image,Page,StyleSheet,Text,View} from "@react-pdf/renderer";
import {Header,HorizontalLine,InfoCenterValue,InfoValue} from "./ReportElement";

import { Table, TD, TR } from "@ag-media/react-pdf-table";
import { a_subject_full_name, subject_full_name, term } from "@/utils/reportList";
import {generateChartImage, generateSubsidiaryChartImage} from "./charts/SubjectChart";
import { useEffect, useState } from "react";
import { brightness } from "color-tin";
import _ from 'lodash'
import { roundOff } from "@/utils";
import {colorTin} from 'color-tin'

//
 function CountEachGrade({data}) { 

  const [chartImage, setChartImage] = useState(null);
  const [subsidiaryChartImage, setSubsidiaryChartImage] = useState(null);

  const chartStyles = StyleSheet.create({
  page: { padding: 10 },
  title: { fontSize: 20, marginBottom: 10 },
  chart: { marginTop: 20, width: "100%", height: "auto" },
});

  // 
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

  let {transformed_data,selected_clas,theme_bg, paper_mode, num_per_stream, grade_count } = data
  let sublength = transformed_data[0]?.subjects?.length;
  data.info = data.school_info
  let is_a_level = parseInt(data.selected_clas.split(' ')[1])>4 //GET A LEVEL
  let a_subsidiariy = is_a_level?['GP','ICT','SM','S/M']:['GP','SM','S/M']
  //   
  let princepal_grade_count = grade_count.filter(count=>!a_subsidiariy.includes(count.subject))
  princepal_grade_count = grade_count.filter(count=>count.subject!=='*')
  let subsidiary_grade_count = grade_count.filter(count=>['GP','SM','ICT','S/M'].includes(count.subject))
  let streams = Object.keys(num_per_stream?.streams).join(' , ')
  //   
  let sorted_grade = (_.orderBy(princepal_grade_count, 
    ["TOTAL_WAIGHT", "Aper", "Bper"],['desc','desc','desc']))
    .filter(data=>data.TOTAL>0)
    // console.log(princepal_grade_count);
    
    // 
  let subsidiary_sorted_grade = (_.orderBy(subsidiary_grade_count, 
    ["TOTAL_WAIGHT", "Aper", "Bper"],['desc','desc','desc']))
    .filter(data=>data.TOTAL>0);    
  //   
  useEffect(() => {
    generateChartImage(sorted_grade.filter(data=>data.TOTAL>0) , is_a_level,selected_clas ).then(setChartImage);
  }, []);

  // SUBSIDIARY SUBJECT CHART
  useEffect(() => {
    generateSubsidiaryChartImage(subsidiary_grade_count.filter(data=>data.TOTAL>0)).then(setSubsidiaryChartImage);
  }, []);
  // 
   let colors = colorTin(theme_bg, 10)

  return (
    <Document>
        <Page
          orientation="landscape"
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
              <Header data={data} show_photo={false} summary={true} headerLandscape={{height: "16%"}} />
              <HorizontalLine color={theme_bg}/>
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
                        color: theme_bg,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {data.info['EXAMS'] || term[data.set_time.exam]}
                    </Text>
                  </TD>
                  <TD style={{ flex: 1 }}>Term:</TD>
                  <TD style={{ flex: 2, textTransform:'uppercase'}}>{(is_a_level?data.set_time.term:data?.info['TERM'])}</TD>
                  <TD style={{ flex: 1 }}>Stream:</TD>
                  <TD style={{ flex: 3 }}>{streams}</TD>
                </TR>
              </Table>
              <View
                style={{
                  display: "flex",
                  paddingTop: "5",
                  paddingBottom: "2",
                  flexDirection: "row",
                  width: "100%",
                  fontWeight: "bold",
                  backgroundColor: theme_bg,
                  height:'25',
                  color:brightness(theme_bg)<65?"white":'black'
                }}
              >
                <Text style={{width: "4%", paddingLeft: "4" }}>PSN</Text>
                <Text style={{ width: "32%", paddingLeft: "4"}}>
                  SUBJECT
                </Text>
                <Text
                  style={{
                    flex: sublength,
                    width: "50%",
                    textAlign: "center",
                  }}
                >
                  NUMBER OF GRADE
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  paddingTop: "2",
                  paddingBottom: "2",
                  flexDirection: "row",
                  width: "100%",
                  fontWeight: "bold",
                  color:theme_bg,
                }}
              >
                <Text
                  style={{
                    flex:3,
                    width: "33%",
                    textTransform: "uppercase",
                    backgroundColor: theme_bg,
                  }}
                ></Text>
                {/* horizontal list of subjects */}
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'A'} />}
                </Text>
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'B'} />}
                </Text>
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'C'} />}
                </Text>
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'D'} />}
                </Text>
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'E'} />}
                </Text>
                {is_a_level && (
                  <>
                    <Text style={{ flex: 1 }}>
                      {<InfoCenterValue text={'O'} />}
                    </Text>
                    <Text style={{ flex: 1 }}>
                      {<InfoCenterValue text={'F'} />}
                    </Text>
                  
                  </>
                )}
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'MISS'} />}
                </Text>
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'TOTAL'} />}
                </Text>
              </View>
              {/* subject listed here */}
              {sorted_grade?.map((count, i) => { 

                return is_a_level? (
                  <View
                    key={i}
                    style={{
                    display: "flex",
                    paddingTop: "4",
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor: i % 2 === 1 ? colors.lighter_80 : "#fff",
                    height:'19',
                    borderColor:colors.lighter_70,
                    borderBottomWidth:1
                  }}
                >
                  <Text style={{width: "5%", paddingLeft: "4"}}>{`${i+1}`}</Text>
                  <Text
                    style={{
                      width: is_a_level?"20%":"25%",
                      textTransform: "uppercase",
                      fontSize:'9',
                    }}
                  >
                    <InfoValue text={a_subject_full_name[count.subject] || count?.subject} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.A} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.B} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.C} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.D} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.E} />
                  </Text>
                  
                    <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                      <InfoCenterValue text={count.O} />
                    </Text>
                    <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                      <InfoCenterValue text={count.F} />
                    </Text>
                    <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                      <InfoCenterValue text={count.MISS} />
                    </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.TOTAL} />
                  </Text>
                </View>
                ):(
                  <View
                    key={i}
                    style={{
                    display: "flex",
                    paddingTop: "4",
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor: i % 2 === 0 ? "#d9d9d9" : "#fff",
                    height:'19'
                  }}
                >
                  <Text style={{width: "5%", paddingLeft: "4"}}>{`${i+1}`}</Text>
                  <Text
                    style={{
                      width: is_a_level?"20%":"25%",
                      textTransform: "uppercase",
                      fontSize:'9',
                    }}
                  >
                    <InfoValue text={a_subject_full_name[count.subject]} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.A} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.B} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.C} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.D} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.E} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.MISS} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.TOTAL} />
                  </Text>
                </View>
                )
              }
              )}
             <View style={{position:'absolute',bottom:'-3', width:'100%'}}>
                <HorizontalLine margin_bottom={'0'} color={theme_bg} />
              </View>
            </View>
          </View>
          <Image src={data.main_school_info?.logo} style={{height:500, width:500, position:'absolute', opacity:.1}}/>

        </Page>
        
        {/* graphical representation */}
        <Page
          orientation="landscape"
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
              <Header data={data} show_photo={false} summary={true} headerLandscape={{height: "16%"}} />
              <HorizontalLine color={theme_bg}/>
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
                        color: theme_bg,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {data.info['EXAMS'] || term[data.set_time.exam]}
                    </Text>
                  </TD>
                  <TD style={{ flex: 1 }}>Term:</TD>
                  <TD style={{ flex: 2, textTransform:'uppercase'}}>{(is_a_level?data.set_time.term:data?.info['TERM'])}</TD>
                  <TD style={{ flex: 1 }}>Stream:</TD>
                  <TD style={{ flex: 3 }}>{streams}</TD>
                </TR>
              </Table>
              {/* chart */}
                <Text style={{color:theme_bg, fontWeight:'bold', fontSize:12}}>Graphical Representation</Text>
                {/* Chart displayed below content */}
                {chartImage && <Image src={chartImage} style={chartStyles.chart} />}
              {/*  */}
             <View style={{position:'absolute',bottom:'-3', width:'100%'}}>
                <HorizontalLine margin_bottom={'0'} color={theme_bg} />
              </View>
            </View>
          </View>
          <Image
            logo={'logo.png'} 
            style={{
              height: 500,
              width: 500,
              position: "absolute",
              opacity: 0.08,
            }}
          />
        </Page>
        {/* 
        **
        SUBSIDIARY SUBJECTS
        **
         */}
         {is_a_level && (
          <>
        <Page
          orientation="landscape"
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
              <Header data={data} show_photo={false} summary={true} headerLandscape={{height: "16%"}} />
              <HorizontalLine color={theme_bg}/>
              <Table style={{ border: "0", marginBottom: 5 }}>
                <TR>
                  <TD style={{ flex: 1 }}>Class:</TD>
                  <TD style={{ flex: 2 }}>{selected_clas}</TD>
                  <TD style={{ flex: 1 }}>Year:</TD>
                  <TD style={{ flex: 4 }}>{is_a_level?data.set_time.year:data?.info['YEAR']}</TD>
                  <TD style={{ flex: 4 }}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: theme_bg,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {data.info['EXAMS']}
                    </Text>
                  </TD>
                  <TD style={{ flex: 1 }}>Term:</TD>
                  <TD style={{ flex: 2, textTransform:'uppercase'}}>{(is_a_level?data.set_time.term:data?.info['TERM'])}</TD>
                  <TD style={{ flex: 1 }}>Stream:</TD>
                  <TD style={{ flex: 3 }}>{streams}</TD>
                </TR>
              </Table>
              <View
                style={{
                  display: "flex",
                  paddingTop: "5",
                  paddingBottom: "2",
                  flexDirection: "row",
                  width: "100%",
                  fontWeight: "bold",
                  backgroundColor: theme_bg,
                  height:'25',
                  color:brightness(theme_bg)<65?"white":'black'
                }}
              >
                <Text style={{width: "4%", paddingLeft: "4" }}>PSN</Text>
                <Text style={{ width: "32%", paddingLeft: "4"}}>
                  SUBJECT
                </Text>
                <Text
                  style={{
                    flex: sublength,
                    width: "50%",
                    textAlign: "center",
                  }}
                >
                  NUMBER OF GRADE
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  paddingTop: "2",
                  paddingBottom: "2",
                  flexDirection: "row",
                  width: "100%",
                  fontWeight: "bold",
                  color:theme_bg,
                }}
              >
                <Text
                  style={{
                    width: "33%",
                    textTransform: "uppercase",
                    backgroundColor: theme_bg,
                  }}
                ></Text>
                {/* horizontal list of subjects */}
                
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'O'} />}
                </Text>
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'F'} />}
                </Text>
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'MISS'} />}
                </Text>
                <Text style={{ flex: 1 }}>
                  {<InfoCenterValue text={'TOTAL'} />}
                </Text>
              </View>
              {/* subject listed here */}
              {subsidiary_sorted_grade?.map((count, i) => {                                
                return (
                  <View
                    key={i}
                    style={{
                    display: "flex",
                    paddingTop: "4",
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor: i % 2 === 0 ? "#d9d9d9" : "#fff",
                    height:'19'
                  }}
                >
                  <Text style={{width: "5%", paddingLeft: "4"}}>{`${i+1}`}</Text>
                  <Text
                    style={{
                      width: "28%",
                      textTransform: "uppercase",
                      fontSize:'9',
                    }}
                  >
                    <InfoValue text={subject_full_name[count.subject]} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.O} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.F} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.MISS} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.TOTAL} />
                  </Text>
                </View>
                )
              }
                
              )}
             <View style={{position:'absolute',bottom:'-3', width:'100%'}}>
                <HorizontalLine margin_bottom={'0'} color={theme_bg} />
              </View>
            </View>
          </View>
          <Image src={data.main_school_info?.logo} style={{height:500, width:500, position:'absolute', opacity:.1}}/>

        </Page>
        {/* graphical representation */}
        <Page
          orientation="landscape"
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
              <Header data={data} show_photo={false} summary={true} headerLandscape={{height: "16%"}} />
              <HorizontalLine color={theme_bg}/>
              <Table style={{ border: "0", marginBottom: 5 }}>
                <TR>
                  <TD style={{ flex: 1 }}>Class:</TD>
                  <TD style={{ flex: 2 }}>{selected_clas}</TD>
                  <TD style={{ flex: 1 }}>Year:</TD>
                  <TD style={{ flex: 4 }}>{is_a_level?data.set_time.year:data?.info['YEAR']}</TD>
                  <TD style={{ flex: 4 }}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: theme_bg,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {data.info['EXAMS'] ||term[data.set_time.exam]}
                    </Text>
                  </TD>
                  <TD style={{ flex: 1 }}>Term:</TD>
                  <TD style={{ flex: 2, textTransform:'uppercase'}}>{(is_a_level?data.set_time.term:data?.info['TERM'])}</TD>
                  <TD style={{ flex: 1 }}>Stream:</TD>
                  <TD style={{ flex: 3 }}>{streams}</TD>
                </TR>
              </Table>
              {/* chart */}
                <Text style={{color:theme_bg, fontWeight:'bold', fontSize:12}}>Graphical Representation</Text>
                {/* Chart displayed below content */}
                {subsidiaryChartImage && <Image src={subsidiaryChartImage} style={chartStyles.chart} />}
              {/*  */}
             <View style={{position:'absolute',bottom:'-3', width:'100%'}}>
                <HorizontalLine margin_bottom={'0'} color={theme_bg} />
              </View>
            </View>
          </View>
          <Image src={data.main_school_info?.logo} style={{height:500, width:500, position:'absolute', opacity:.1}}/>

        </Page>
         </>)}
    </Document>
  );
}

export default CountEachGrade;
