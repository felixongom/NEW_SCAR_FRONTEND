import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import {capitalize} from "@/utils/reshpe_data"
import { getScore } from "@/utils";
// 
const styles = StyleSheet.create({
  headerSection: {
    width: "100%",
    height: "13%",
    paddingVertical:'2',
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom:2
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerInfo: {
    width: "70%",
    height: "100%",
  },
});
function InfoValue({ text, padding, vstyle={} }) {
  return <Text style={{ paddingLeft: padding ||"3", ...vstyle}}>{text}</Text>;
}
//
function InfoCenterValue({ text }) {
  return <Text style={{ textAlign: "center", width: "100%" }}>{text}</Text>;
}

function Header({headerLandscape, show_photo, picture,data, subject=null}) {

  return (
    <View style={[styles.headerSection, headerLandscape]}>
      <Image src={data?.main_school_info?.logo} style={{ width: 75, height: 75 }} />
      <View style={styles.headerInfo}>
        <Text
          style={{
            fontSize:20,
            textAlign: "center",
            fontFamily: "Helvetica-Bold",
            marginBottom:'2'
          }}
        >
          {data?.info['SCHOOL NAME']?.toUpperCase() || ""}
        </Text>
        <Text style={{ fontSize: 12, textAlign: "center",marginBottom:'2' }}>
          {data?.info['BOX NO']?.toUpperCase() || ""}, {data?.info['DISTRICT/CITY']?.toUpperCase() || ""}
        </Text>
        {data?.info['CAMPUS'] && 
          <Text style={{ fontSize: 10,fontStyle:'italic', textAlign: "center",marginBottom:'2' }}>
            {capitalize(data?.info['CAMPUS'] ||'')} Campus
          </Text>
        }
        <Text style={{ fontSize: 11, textAlign: "center",marginBottom:'2' }}>
          Email: {data?.info['EMAIL'] || ""} | Tel:  {data?.info['PHONE'] || ""}
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center",marginBottom:'2' }}>
          {data?.info['LOCATION'] || ""}
        </Text>
        <Text style={{ fontSize: 10, textAlign: "center", fontWeight:'bold', fontStyle:'italic'}}>
          {capitalize(data?.info['MOTO']) || ""}
        </Text>
      </View>

      {subject? (<Text style={{fontSize:50,}}>{subject}</Text>):
        show_photo?<Image
          src={picture? picture:"/person.png" } // use full URL, NOT "/logo.png"
          style={{ width: picture?65:75, height: 75 }}
        />:<View style={{width: 50, height: 50,}}/>
      }
      
    </View>
  );
}
function UnebHeader({headerLandscape, data}) {
  
  return (
    <View style={[styles.headerSection, headerLandscape]}>
      <Image src={"/UNEB_LOGO.png"} style={{ width: 75, height: 75 }} />
      <View style={styles.headerInfo}>
        <Text
          style={{
            fontSize:20,
            textAlign: "center",
            fontFamily: "Helvetica-Bold",
            marginBottom:'2'
            
          }}
        >
          {data?.info['SCHOOL NAME']?.toUpperCase() || ""}
        </Text>
        <Text style={{ fontSize: 12, textAlign: "center",marginBottom:'2' }}>
          {data?.info['BOX NO']?.toUpperCase() || ""}, {data?.info['DISTRICT/CITY']?.toUpperCase() || ""}
        </Text>
        {data?.info['CAMPUS'] && 
          <Text style={{ fontSize: 10,fontStyle:'italic', textAlign: "center",marginBottom:'2' }}>
            {capitalize(data?.info['CAMPUS'] ||'')} Campus
          </Text>
          }
        <Text style={{ fontSize: 11, textAlign: "center",marginBottom:'2' }}>
          Email: {data?.info['EMAIL'] || ""} | Tel:  {data?.info['PHONE'] || ""}
        </Text>
        <Text style={{ fontSize: 9, textAlign: "center",marginBottom:'2' }}>
          {data?.info['LOCATION'] || ""}
        </Text>
        <Text style={{ fontSize: 10, textAlign: "center", fontWeight:'bold', fontStyle:'italic'}}>
          {capitalize(data?.info['MOTO']) || ""}
        </Text>
      </View>

      <Image
          src={data?.main_school_info?.logo} // use full URL, NOT "/logo.png"
          style={{ width: 70, height: 70 }}
        />
      
    </View>
  );
}
const HolderInfo = ({data, report}) => (
  
  <Table style={{ marginBottom: "5", borderColor: "#a3c2c2" }}>
    <TR>
      <TD style={{ flex: 1, paddingTop: "5", paddingBottom: "5" }}>
        <InfoValue text={"NAME"} />
      </TD>
      <TD style={{ flex: 6 }}>
        <Text
          style={{
            paddingLeft: "4",
            textTransform: "uppercase",
            borderBottom: "0",
            borderTop: "0",
            fontWeight: "bold",
            fontSize: "10",
          }}
        >
          {report['STUDENT NAME']?.toUpperCase()}
        </Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <InfoValue text={"YEAR"} />
      </TD>
      <TD style={{ flex: 2 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{data.info['YEAR']}</Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ paddingLeft: "4", textAlign: "center" }}>TERM</Text>
      </TD>
      <TD style={{ flex: 2 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{data.info['TERM']?.toUpperCase()}</Text>
      </TD>
    </TR>
    <TR style={{height:'20'}}>
      <TD style={{ flex: 1 }}>
        <InfoValue text={"GENDER"} />
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{report['SEX']}</Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <InfoValue text={"CLASS"} />
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{data.selected_clas}</Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <InfoValue text={"STREAM"} />
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{report['STREAM']?.toUpperCase()}</Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <InfoValue text={"PAY CODE"} />
      </TD>
      <TD style={{ flex: 2 }}>
        <InfoValue text={report['PAY CODE']} />
      </TD>
    </TR>
  </Table>
);

function Grade({grade_range}) {
  return (
    <Table style={{ width: "100%", marginTop: "15", fontSize: "9" }}>
      <TH>
        <TD style={{flex:2, padding: "2", textAlign:'center' }}><InfoCenterValue text={'SCORE RANGE'}/></TD>
        <TD style={{flex:1, padding: "2", textAlign:'center' }}><InfoCenterValue text={'GRADE'}/></TD>
        <TD style={{flex:3, padding: "2",textAlign:'center' }}>ACHIEVEMENT LEVEL</TD>
        <TD style={{flex:10,padding: "2", textAlign:'center'}}>GRADE DESCRIPTION</TD>
      </TH>
      {grade_range?.map((range, i)=>(
        <TR>
          <TD style={{flex:2, padding: "2",width:'100%', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center' }}>{range['RANGE_STRING']}</TD>
          <TD style={{flex:1, padding: "2", width:'100%', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center'}}>{range['GRADE']}</TD>
          <TD style={{flex:3, padding: "2" }}>{range['COMMENT']}</TD>
          <TD style={{flex:10, padding: "2" }}>{range['DESCRIPTION']}</TD>
        </TR>
      ))}
      
    </Table>
  );
}
function Remarks({selected_clas, num_per_stream,report, info}) {  
  
 return(
   <>
    <Table style={{ border: "0", marginTop: "5"}}>
      {
        report.total_points >= 0 && <TR
        style={{
          marginTop: "15",
          marginBottom: "10",
          fontSize: 11,
          borderBottom: "1 solid #333",
          paddingBottom: 3,
        }}
      >
        <TD>
          <Text>Number of points: </Text>
          <Text style={{ fontWeight: "bold" }}> {report['total_points']} </Text>out of  
          <Text style={{ fontWeight: "bold" }}> {" 20 "} </Text>
        </TD>
      </TR>
      }
      {selected_clas<5 && info['PUT POSITON']===true &&
        <TR
          style={{
            marginTop: "10",
            fontSize: 11,
            borderBottom: "1 solid #333",
            paddingBottom: 3,
          }}
        >
          <TD>
            <Text>Position in stream: </Text>
            <Text style={{ fontWeight: "bold" }}> {report['PSN_IN_STREAM']} </Text>out of  
            <Text style={{ fontWeight: "bold" }}> {num_per_stream?.streams[report['STREAM']]}</Text>
          </TD>
          <TD>
            <Text>Position in class: </Text>
            <Text style={{ fontWeight: "bold" }}> {report['PSN']} </Text>out of 
            <Text style={{ fontWeight: "bold" }}> {num_per_stream?.total}</Text>
          </TD>
        </TR>
       }
    </Table>
    {/*  */}
    <View
      style={{
        display: "flex",
        width: "100%",
        marginTop: "10",
        flexDirection: "row",
        fontSize: "11",
      }}
    >
      <Text>
        Next term begins on{" "}
        <Text style={{ fontWeight: "bold" }}>
          {info['NEXT TERM BEGINS']||"__/__/____"} 
        </Text> and ends on{" "}
        <Text style={{ fontWeight: "bold" }}>
          {info['NEXT TERM ENDS'] ||"__/__/____"}
        </Text>
      </Text>
    </View>
    <View style={{ display: "flex", width: "100%", marginTop: "10" }}>
      <Text style={{ borderBottom: "1 dashed black", paddingBottom:'2' }}>Class Teacher's comment:</Text>
    </View>
    <View style={{ display: "flex", width: "100%", marginTop: "10" }}>
      <Text style={{ borderBottom: "1 dashed black", paddingBottom:'2' }} >Head Teacher's comment:</Text>
      <View />
    </View>
  </>
 )
}
function ARemarks({num_per_stream, report, begins, ends, put_position}) {  
  
 return(
   <>
    <Table style={{ border: "0", marginTop: "5"}}>
      {
        (report.total_points >= 0 || report.total_points <= 20) && <TR
        style={{
          marginTop: "15",
          marginBottom: "10",
          fontSize: 11,
          borderBottom: "1 solid #333",
          paddingBottom: 3,
        }}
      >
        <TD>
          <Text>Number of points: </Text>
          <Text style={{ fontWeight: "bold" }}> {report['total_points']} </Text>out of  
          <Text style={{ fontWeight: "bold" }}> {" 20 "} </Text>
        </TD>
      </TR>
      }
      {put_position===true &&
        <TR
          style={{
            marginTop: "10",
            fontSize: 11,
            borderBottom: "1 solid #333",
            paddingBottom: 3,
          }}
        >
          <TD>
            <Text>Position in stream: </Text>
            <Text style={{ fontWeight: "bold" }}> {report['PSN_IN_STREAM']} </Text>out of  
            <Text style={{ fontWeight: "bold" }}> {num_per_stream?.streams[report['STREAM']]}</Text>
          </TD>
          <TD>
            <Text>Position in class: </Text>
            <Text style={{ fontWeight: "bold" }}> {report['PSN']} </Text>out of 
            <Text style={{ fontWeight: "bold" }}> {num_per_stream?.total}</Text>
          </TD>
        </TR>
       }
    </Table>
    {/*  */}
    <View
      style={{
        display: "flex",
        width: "100%",
        marginTop: "10",
        flexDirection: "row",
        fontSize: "11",
      }}
    >
      <Text>
        Next term begins on{" "}
        <Text style={{ fontWeight: "bold" }}>
          {begins ||"__/__/____"} 
        </Text> and ends on{" "}
        <Text style={{ fontWeight: "bold" }}>
          {ends || "__/__/____"}
        </Text>
      </Text>
    </View>
    <View style={{ display: "flex", width: "100%", marginTop: "10" }}>
      <Text style={{ borderBottom: "1 dashed black", paddingBottom:'2' }}>Class Teacher's comment:</Text>
    </View>
    <View style={{ display: "flex", width: "100%", marginTop: "10" }}>
      <Text style={{ borderBottom: "1 dashed black", paddingBottom:'2' }} >Head Teacher's comment:</Text>
      <View />
    </View>
  </>
 )
}



function HorizontalLine({color, margin_bottom}){
  
  return (
  <View style={{width:'100%'}}>
    <View style={{height:4, width:'100%', backgroundColor:`${color}`, marginBottom:'1', marginTop:'1'}}/>
    <View style={{height:1, width:'100%', backgroundColor:`${color}`, marginBottom:margin_bottom?margin_bottom:'2'}}/>
  </View>
  
  )
}
function Dash({dash_style={}}){
 return <View style={[{height:'1', width:7, backgroundColor:'black'},dash_style]}/>
}

/**
 * 
 * a level elements
 */
const AHolderInfo = ({data, report}) => (
  
  
  
  <Table style={{ marginBottom: "5", borderColor: "#a3c2c2" }}>
    <TR>
      <TD style={{ flex: 1, paddingTop: "5", paddingBottom: "5" }}>
        <InfoValue text={"NAME"} />
      </TD>
      <TD style={{ flex: 6 }}>
        <Text
          style={{
            paddingLeft: "4",
            textTransform: "uppercase",
            borderBottom: "0",
            borderTop: "0",
            fontWeight: "bold",
            fontSize: "10",
          }}
        >
          {report['STUDENT NAME']?.toUpperCase()}
        </Text>
      </TD>
      
      <TD style={{ flex: 1 }}>
        <InfoValue text={"YEAR"} />
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{data.set_time.year}</Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ paddingLeft: "4", textAlign: "center" }}>TERM</Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{data.set_time.term}</Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <InfoValue padding={1} text={"COMBN"} />
      </TD>
      <TD style={{ flex: 2 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{report.combination}</Text>
      </TD>
    </TR>
    <TR style={{height:'20'}}>
      <TD style={{ flex: 1 }}>
        <InfoValue text={"GENDER"} />
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{report['SEX']?.toUpperCase()}</Text>
      </TD>
      
      <TD style={{ flex: 1 }}>
        <InfoValue text={"CLASS"} />
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{data.selected_clas}</Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <InfoValue text={"STREAM"} />
      </TD>
      <TD style={{ flex: 1 }}>
        <Text style={{ width: "100%", textAlign: "center" }}>{report['STREAM']?.toUpperCase()}</Text>
      </TD>
      <TD style={{ flex: 1 }}>
        <InfoValue text={"PAY CODE"} />
      </TD>
      <TD style={{ flex: 2 }}>
        <InfoCenterValue text={report?.pay_code} />
      </TD>
    </TR>
  </Table>
);
// 
function AGrade({sub_group, grade_range}) {
  
  return (
    <Table style={{ width: "100%", marginTop: "15", fontSize: "9" }}>
        <TR style={{border:'0'}}>
         <TD style={{border:'0', paddingBottom:'2', fontWeight:'bold'}}>{sub_group} SUBJECTS</TD>
        </TR>
        <TR >
            <TD style={{flex:2, padding: "2",width:'100%', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', fontWeight:'bold' }}>RANGE</TD>
        {Object.keys(grade_range)?.map((range, i)=>(
            <TD key={i} style={{flex:2, padding: "2",width:'100%', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center' }}>{range}</TD>
          ))}
        </TR>
        <TR >
            <TD style={{flex:2, padding: "2",width:'100%', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', fontWeight:'bold' }}>LEVEL</TD>
        {Object.values(grade_range)?.map((grade, i)=>(
            <TD key={i} style={{flex:2, padding: "2",width:'100%', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center' }}>{getScore(grade)}</TD>
          ))}
        </TR>
    </Table>
  );
}

export { InfoValue, InfoCenterValue, Header,UnebHeader, Grade, AGrade, HolderInfo, AHolderInfo, Remarks, ARemarks, HorizontalLine, Dash};
