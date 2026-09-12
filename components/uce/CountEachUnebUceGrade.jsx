"use client";

import {Document,Image,Page,StyleSheet,Text,View} from "@react-pdf/renderer";
import {UnebHeader,HorizontalLine,InfoCenterValue,InfoValue} from "@/components/ReportElement";
import { subject_full_name } from "@/utils/reportList";
import {generateChartImage} from "@/components/charts/SubjectChart";
import { useEffect, useState } from "react";
import { brightness } from "color-tin";
import _ from 'lodash'
import { roundOff } from "@/utils";

// 
 function CountEachUnebUceGrade({data}) { 

  const [chartImage, setChartImage] = useState(null);

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

    let {uneb_uce,paper_mode, selected_clas, theme} = data
        data.info = {...data?.school_info, ...uneb_uce?.SCHOOL_INFO}
        
    let sorted_grade = (_.orderBy(uneb_uce?.SUMMARY, 
        ["TOTAL_WAIGHT", "Aper", "Bper"],['desc','desc','desc']))
        .filter(data=>data.TOTAL>0)
    
  useEffect(() => {
    generateChartImage(sorted_grade , false, selected_clas).then(setChartImage);
  }, []);
  // 
  let  progress_array = sorted_grade?.map(g=>g.PROGRESS)
  const average_progress =  progress_array.reduce((a, b) => a + b) / progress_array.length;
  // 
  return (
    <Document>
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
                <UnebHeader data={data} headerLandscape={{height: "16%"}} />
                <HorizontalLine color={data.theme_bg}/>
                <Text style={{ marginBottom:3,fontWeight:'bold', textAlign:'center', color:theme_bg, fontSize:14}}>{data?.info?.EXAM||selected_clas} - {data?.info?.YEAR} PERFORMANCE PER SUBJECT</Text> 
                {/*  */}
                <View
                    style={{
                    display: "flex",
                    paddingTop: "5",
                    paddingBottom: "2",
                    flexDirection: "row",
                    width: "100%",
                    fontWeight: "bold",
                    backgroundColor: data.theme_bg,
                    height:'25',
                    color:brightness(data.theme_bg)<65?"white":'black'
                    }}
                >
                    <Text style={{width: "4%", paddingLeft: "4" }}>PSN</Text>
                    <Text style={{ width: "32%", paddingLeft: "4"}}>
                    SUBJECT
                    </Text>
                    <Text
                    style={{
                        flex:1,
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
                    color:data.theme_bg,
                    }}
                >
                    <Text
                    style={{
                        flex:3,
                        width: "33%",
                        textTransform: "uppercase",
                        backgroundColor: data.theme_bg,
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
                    
                    <Text style={{ flex: 1 }}>
                    {<InfoCenterValue text={'X'} />}
                    </Text>
                    <Text style={{ flex: 1 }}>
                    {<InfoCenterValue text={'TOTAL'} />}
                    </Text>
                </View>
              {/* subject listed here */}
              {sorted_grade?.map((count, i) => { 
                
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
                      width: "25%",
                      textTransform: "uppercase",
                      fontSize:'9',
                    }}
                  >
                    <InfoValue text={subject_full_name[count.subject] || count?.subject} />
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
                    <InfoCenterValue text={count.X} />
                  </Text>
                  <Text key={i} style={{ flex: 1, fontSize:'9' }}>
                    <InfoCenterValue text={count.TOTAL} />
                  </Text>
                </View>
                  
                )})}
             <View style={{position:'absolute',bottom:'-3', width:'100%'}}>
                <HorizontalLine margin_bottom={'0'} color={data.theme_bg} />
              </View>
            </View>
          </View>
          <Image src={data.main_school_info?.logo} style={{height:500, width:500, position:'absolute', opacity:.1}}/>

        </Page>
        {/* progress */}
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
                <UnebHeader data={data} headerLandscape={{height: "16%"}} />
                <HorizontalLine color={data.theme_bg}/>
                <Text style={{ marginBottom:3,fontWeight:'bold', textAlign:'center', color:theme_bg, fontSize:14}}>{data?.info?.EXAM||selected_clas} - {data?.info?.YEAR} PROGRESS(WORK DONE) PER SUBJECT</Text> 
                {/*  */}
                <View
                    style={{
                    display: "flex",
                    paddingTop: "5",
                    paddingBottom: "2",
                    flexDirection: "row",
                    width: "100%",
                    fontWeight: "bold",
                    backgroundColor: data.theme_bg,
                    height:'25',
                    color:brightness(data.theme_bg)<65?"white":'black'
                    }}
                >
                    <Text style={{width: "4%", paddingLeft: "4" }}>PSN</Text>
                    <Text style={{ width: "32%", paddingLeft: "4"}}>
                    SUBJECT
                    </Text>
                    <Text
                    style={{
                        flex:1,
                        width: "50%",
                        textAlign: "center",
                    }}
                    >
                      PROGRESS
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
                    color:data.theme_bg,
                    }}
                >
                    <Text
                    style={{
                        width: "33%",
                        textTransform: "uppercase",
                        backgroundColor: data.theme_bg,
                    }}
                    />
                    {/* horizontal list of subjects */}
                    <Text style={{ width:80}}>
                      <InfoCenterValue text={'%AGE'} />
                    </Text>
                    
                </View>
              {/* subject listed here */}
              {sorted_grade?.map((count, i) => { 

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
                    <InfoValue text={subject_full_name[count.subject] || count?.subject} />
                  </Text>
                  <Text key={i} style={{ width:80, fontSize:'9' }}>
                    <InfoCenterValue text={roundOff(count.PROGRESS, 2)} />
                  </Text>
                  <View style={{
                      position:'relative', 
                      flex:1,
                      paddingTop:2
                    }}>
                      
                      <View style={{
                        position:'absolute', 
                        backgroundColor: data.theme_bg,
                        width:roundOff(count.PROGRESS, 2)+"%",
                        height:'7'
                      }}/>
                    </View>
                </View>
                )})}
                <View 
                  style={{
                    display: "flex",
                    paddingTop: "4",
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor:"#fff",
                    height:'25',
                    fontWeight:'bold',
                    fontSize:'11'
                  }}
                >
                <Text style={{width: "5%", paddingLeft: "4"}}>#</Text>
                <Text
                  style={{
                    width: "28%",
                    textTransform: "uppercase",
                    fontSize:'9',
                  }}
                >
                  <InfoValue text={'GENERAL PROGRESS'} />
                </Text>
                <Text style={{ width:80 }}>
                  <InfoCenterValue text={roundOff(average_progress, 2)} />
                </Text>
                <View style={{
                  position:'relative', 
                  flex:1,
                  paddingTop:2
                }}>
                  <View style={{
                    position:'absolute', 
                    backgroundColor: theme_bg,
                    width:roundOff(average_progress, 2)+"%",
                    height:'12'
                    }}/>
                  </View>
                </View>
             <View style={{position:'absolute',bottom:'-3', width:'100%'}}>
                <HorizontalLine margin_bottom={'0'} color={data.theme_bg} />
              </View>
            </View>
          </View>
          <Image src={data.main_school_info?.logo} style={{height:500, width:500, position:'absolute', opacity:.1}}/>

        </Page>
        {/* graphical representation */}
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
              <UnebHeader data={data} headerLandscape={{height: "16%"}} />
                <HorizontalLine color={data.theme_bg}/>
                <Text style={{ marginVertical:3,MARfontWeight:'bold', textAlign:'center', color:theme_bg, fontSize:14}}>{data?.info?.EXAM||selected_clas} - {data?.info?.YEAR} GRAPHICAL REPRESENTATION</Text> 
                {/* Chart displayed below content */}
                {chartImage && <Image src={chartImage} style={chartStyles.chart} />}
              {/*  */}
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

export default CountEachUnebUceGrade;
