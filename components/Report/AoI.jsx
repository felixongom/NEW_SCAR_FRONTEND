import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { roundOff,isRegistered } from "@/utils";
import {subject_full_name} from "@/utils/reportList"

const styles = StyleSheet.create({
  page: {
    paddingTop: 5,
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #f2e6ff",
    borderTop: "1 solid #f2e6ff",
  },
  cell1: {
    flex: 1,
    padding: 4,
    fontSize: 10,
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 10,
    borderRight: "0 solid #f2e6ff",
    borderLeft: "1 solid",
    color: "#331",
  },
  cell2: {
    padding: 4,
    paddingLeft: "6",
    color: "#331",
    fontSize: 10,
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 11,
    borderRight: "1 solid #f2e6ff",
    borderLeft: "0.5 solid #f2e6ff",
  },
  flexing: {
    flex: 4,
    textTransform: "uppercase",
    display: "flex",
    alignContent: "center",
  },
  intStyle: {
    height: "100%",
    fontSize: "10",
  },
});

const AoI = ({subjects}) => {  

  return(
  <View
    style={[styles.page, { padding: "0", marginTop: 10, position: "relative" }]}
  >
    <View>
      <Table>
        <TH>
          <TD style={{ flex: 4 }}>
            <Text style={{ paddingLeft: "3" }}>SUBJECT</Text>
          </TD>
          <TD style={{ flex: 6 , width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', paddingVertical:1 }}>
            <Text style={{border:'0', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', paddingVertical:4 }}>FORMATIVE ASSESSMENT</Text>
            {/* <Text style={{border:'0', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', paddingBottom:2}}>ASSESSMENT</Text> */}
          </TD>
          <TD style={{ flex: 2 }}>
            <Text style={{ textAlign: "center", width: "100%" }}>GRADE</Text>
          </TD>
          <TD style={{ flex: 4 }}>
            <Text style={{ textAlign: "center", width: "100%" }}>
              ACHIVEMENT LEVEL
            </Text>
          </TD>
          <TD style={{ flex: 1 }}>
            <Text style={{ textAlign: "center", width: "100%" }}>TR</Text>
          </TD>
        </TH>
        <TR style={{ height: 20 }}>
          <TD style={{ flex: 4 }}></TD>
          <TD style={{ flex: 3 }}>
            <TD
              style={{
                height: "100%",
                width:'100%',
                fontWeight: "bold",
                borderLeft: "0",
                borderTop: "0",
                borderBottom: "0",
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
              }}
            >
              AOI
            </TD>
            <TD
              style={{
                height: "100%",
                width:'100%',
                fontWeight: "bold",
                border: "0",
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
              }}
            >
              AOI(20)
            </TD>
          </TD>
          <TD style={{ flex: 3 }}>
            <TD
              style={{
                height: "100%",
                width:'100%',
                border: "0",
                fontWeight: "bold",
                textAlign: "center",
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
              }}
            >
              AOI(80)
            </TD>
            <TD
              style={{
                height: "100%",
                width:'100%',
                borderLeft: "1",
                borderTop: "0",
                borderBottom: "0",
                borderRight: "0",
                fontWeight: "bold",
                textAlign: "center",
                display:'flex',
                alignItems:'center',
                justifyContent:'center'
              }}
            >
              AOI(100)
            </TD>
          </TD>
          <TD style={{ flex: 2 }}></TD>
          <TD style={{ flex: 4 }}></TD>
          <TD style={{ flex: 1 }}></TD>
        </TR>
        {/*  */}
        {subjects.map((sub, i) => {
          let is_registered = isRegistered(sub['AOI'], sub['AOI(80)'])

          return !is_registered?null:(
            <TR key={i} style={{display:'flex', alignItems:'center', justifyContent:'center',marginTop:4}}>
              <TD style={{ flex: 4, height: "25", borderTop:'0'}}>
                <Text style={{ paddingLeft: "3", borderTop:'0' }}>{subject_full_name[sub?.subject]==='ENTREPRENEURSHIP EDUC'?'ENTREPRENEURSHIP':subject_full_name[sub?.subject]}</Text>
              </TD>
              <TD style={{ flex: 3,height: "25", borderTop:'0' }}>
                <TD
                  style={{
                    height: "100%",
                    width:'100%',
                    borderLeft: "1",
                    borderTop: "0",
                    borderBottom: "0",
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                >{is_registered && roundOff(sub['AOI'],1)}</TD>
                <TD
                  style={{
                    height: "100%",
                    width:"100%",
                    border: "0",
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                >{is_registered && roundOff(sub['AOI(20)'],0)}</TD>
              </TD>
              <TD style={{ flex: 3, height: "25", borderTop:'0' }}>
                <TD
                  style={{
                    height: "100%",
                    width:'100%',
                    border: "0",
                    textAlign: "center",
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                >{is_registered && roundOff(sub['AOI(80)'],0)}</TD>
                <TD
                  style={{
                    height: "100%",
                    width:'100%',
                    borderLeft: "1",
                    borderTop: "0",
                    borderBottom: "0",
                    borderRight: "0",
                    textAlign: "center",
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                >{is_registered && roundOff(sub['AOI(100)'],0)}</TD>
              </TD>
              <TD style={{ flex: 2, height: "25", borderTop:'0' }}>
                <TD
                  style={{
                    height: "100%",
                    width:'100%',
                    borderLeft: "0",
                    borderRight: "0",
                    borderTop: "0",
                    borderBottom: "0",
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                >{is_registered && roundOff(sub['MID GRADE'],1)}</TD>
              </TD>            
              <TD style={{ flex: 4, height: "25", borderTop:'0', fontStyle:'italic'}}> {" "}{sub['MID COMM']}</TD>
              <TD style={{ flex: 1, height: "25", borderTop:'0' }}>
                <TD
                  style={{
                    height: "100%",
                    width:'100%',
                    borderLeft: "0",
                    borderRight: "0",
                    borderTop: "0",
                    borderBottom: "0",
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center'
                  }}
                >{is_registered && sub['TOTAL']?sub['INIT']:''}</TD>
              </TD>  
            </TR>
        )})}
      </Table>
    </View>
  </View>
)
}

export default AoI;
