import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { roundOff,isRegistered } from "@/utils";
import {subject_full_name} from "@/utils/reportList"
import { InfoCenterValue } from "../ReportElement";

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

const Zito = ({subjects, exm}) => { 
  let _exm = {}
  for(let ex in exm){
    if(!exm[ex]) continue
    _exm = {..._exm, [ex]:exm[ex]}
  }
  let exm_keys= Object.keys(_exm);
  // console.log(exm, _exm);

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
          <TD style={{ flex: 1 , width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', paddingTop:'1',paddingBottom:'1' }}>
           AOI
           </TD>
          <TD style={{ flex: 1, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', paddingTop:'1',paddingBottom:'1'}}>
            AOI(20)
          </TD>
          <TD style={{ flex: 1, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', paddingTop:'1',paddingBottom:'1'}}>
            {exm_keys[0]}
          </TD>
          <TD style={{ flex: 1, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', paddingTop:'1',paddingBottom:'1'}}>
            {exm_keys[1]}
          </TD>
          <TD style={{ flex: 1, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', paddingTop:'1',paddingBottom:'1'}}>
            AVG(80)
          </TD>
          <TD style={{ flex: 2, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', paddingTop:'1',paddingBottom:'1'}}>
            TOTAL (100)
          </TD>
          <TD style={{ flex: 1 }}>
            <Text style={{ textAlign: "center", width: "100%" }}>GRADE</Text>
          </TD>
          <TD style={{ flex: 3, flexWrap:'wrap', paddingTop:3 }}>
              ACHIVEMENT LEVEL
              <Text style={{opacity:'0'}}>ACHIVEMENT</Text>
          </TD>
          
        </TH>
        
        {/*  */}
        {subjects.map((sub, i) => {
          let is_registered = isRegistered(sub['AOI'], sub['EOA(80)'])

          return !is_registered?null:(
            <TR key={i} style={{display:'flex', alignItems:'center', justifyContent:'center',marginTop:4}}>
              <TD style={{ flex: 4, height: "25", borderTop:'0'}}>
                <Text style={{ paddingLeft: "3", borderTop:'0' }}>{subject_full_name[sub?.subject]==='ENTREPRENEURSHIP EDUC'?'ENTREPRENEURSHIP':subject_full_name[sub?.subject]}</Text>
              </TD>
              <TD style={{ flex: 1,height: "25", borderTop:'0' }}>
                <InfoCenterValue text={is_registered && roundOff(sub['AOI'],1)}/>
              </TD>
              <TD style={{ flex: 1,height: "25", borderTop:'0' }}>
                <InfoCenterValue text={is_registered && roundOff(sub['AOI(20)'])}/>
              </TD>
              <TD style={{ flex: 1,height: "25", borderTop:'0' }}>
                <InfoCenterValue text={is_registered && roundOff(sub[exm[exm_keys[0]]],0)}/>
              </TD>
              <TD style={{ flex: 1,height: "25", borderTop:'0' }}>
                <InfoCenterValue text={(is_registered && roundOff(sub[exm[exm_keys[1]]],0))}/>
              </TD>
              <TD style={{ flex: 1,height: "25", borderTop:'0' }}>
                <InfoCenterValue text={is_registered && roundOff(sub['EOA(80)'],0)}/>
              </TD>
              <TD style={{ flex: 2,height: "25", borderTop:'0', fontWeight:'bold' }}>
                <InfoCenterValue text={is_registered && roundOff(sub['TOTAL'],0)}/>
              </TD>
              <TD style={{ flex: 1,height: "25", borderTop:'0' }}>
                <InfoCenterValue text={sub['GRADE']}/>
              </TD>         
              <TD style={{ flex: 3, height: "25", borderTop:'0',fontStyle: 'italic',}}> {" "}{sub['COMM']}</TD> 
            </TR>
        )})}
      </Table>
    </View>
  </View>
)
}

export default Zito;
