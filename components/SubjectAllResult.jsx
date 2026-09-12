"use client";

import {Document,Image,Page,StyleSheet,Text,View} from "@react-pdf/renderer";
import {Header,HorizontalLine,InfoCenterValue,InfoValue,} from "./ReportElement";
import { Table, TD, TR } from "@ag-media/react-pdf-table";
import { numbersArray, chunkArray, brightness } from "@/utils/";
// import { reportOneSubject } from "@/utils/reshpe_data";  


function SubjectAllResult({subject, data}) {
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

  let list_header = ['AOI(3)', 'SCORE(20)', 'EOA(80)', 'TOTAL', 'GRADE', 'DESCRIPTOR','PSN'];
  let logo = "http://localhost:3000/logo.png";
  let sublength = 15;
  let perpage = 34
  let reports = chunkArray(numbersArray(80), perpage);
  // 
  let {ranked_data} = data
  // let subject = reportOneSubject(ranked_data||[], "PHY")
  
  
  // 
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
              <Header show_photo={false} data={data} headerLandscape={{}}/>
              <HorizontalLine color={null} />

              <Table style={{ border: "0", marginBottom: 5 }}>
                <TR>
                  <TD style={{ flex: 1 }}>Class:</TD>
                  <TD style={{ flex: 2 }}>Sineor III</TD>
                  <TD style={{ flex: 1 }}>Year:</TD>
                  <TD style={{ flex: 2 }}>2027</TD>
                  <TD style={{ flex: 3 }}>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "blue",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                       {subject} results
                    </Text>
                  </TD>
                  <TD style={{ flex: 1 }}>Term:</TD>
                  <TD style={{ flex: 1 }}>III</TD>
                  <TD style={{ flex: 1 }}>Stream:</TD>
                  <TD style={{ flex: 2 }}>Yellow green blo</TD>
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
                  backgroundColor: "#990033",
                  color:brightness(data.theme_bg)<65?"white":'black'
                }}
              >
                <Text style={{ flex: 3, width: "100%", paddingLeft: "4",fontSize:'12' }}>
                  LEARNER
                </Text>
                <Text
                  style={{
                    flex: sublength,
                    width: "100%",
                    textAlign: "center",
                    fontSize:'12',
                    backgroundColor:'yellow',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    textAlign:'center'
                    
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
                  color: "#990033",
                }}
              >
                <Text style={{width: "3%", paddingLeft: "4" }}>#</Text>
                <Text
                  style={{
                    width: "30%",
                    height:'100%',
                    textTransform: "uppercase",
                    backgroundColor: "#990033",
                  }}
                ></Text>
                {list_header.map((subj, i) => (
                  <Text key={i} style={{fontSize:'10', flex: subj==='DESCRIPTOR'?3:2 }}>
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
                    height:'19',
                    fontSize:'10',
                    backgroundColor: i % 2 === 0 ? "#f2f2f2" : "#fff",
                    color:(i%6==0)?'red':(i%5==0)?'green':'black'
                  }}
                >
                  <Text style={{width: "5%", paddingLeft: "4"}}>{`${((perpage*chunk_i)+i)+1}`}</Text>
                  <Text
                    style={{
                    //   flex: 8,
                      width: "30%",
                      textTransform: "uppercase",
                      fontSize:'10',
                    }}
                  >
                    <InfoValue text={"atimangno emanuella"} />
                  </Text>
                  {numbersArray(list_header.length).map((subj, i) => (
                    <Text key={i} style={{ flex: i===5?3:2 , height:'100%', width:'100%',paddingTop: "4",paddingBottom: "4"}}>
                      <InfoCenterValue text={"-d"} />
                    </Text>
                  ))}
                </View>
              ))}
              <View style={{position:'absolute',bottom:'-10', width:'100%'}}>
                <HorizontalLine margin_bottom={'0'} color={"#990033"} />
                <Text style={{padding:'5', textAlign:'center', fontStyle:"italic", fontSize:'9'}}>AOI: Average Of Activity of Integration, EOA: Average of all Exams</Text>
              </View>
            </View>
          </View>
          <Image
            source={logo}
            style={{
              height: 500,
              width: 500,
              position: "absolute",
              opacity: 0.08,
            }}
          />
        </Page>
      ))}
    </Document>
  );
}
export default SubjectAllResult;
