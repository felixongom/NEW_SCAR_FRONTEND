import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import {Grade, InfoCenterValue, InfoValue} from "@/components/ReportElement"
import OverallAchivement from "@/components/OverallAchivement"
const styles = StyleSheet.create({
  page: {
    paddingTop: 5,
    width:"100%"
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #f2e6ff',
    borderTop: '1 solid #f2e6ff'
  },
  cell1: {
    flex: 1,
    padding: 4,
    fontSize: 10,
    textAlign:'left',
    fontWeight:'bold',
    fontSize:10,
    borderRight: '0 solid #f2e6ff',
    borderLeft: '1 solid',
    color:'#331'
  },
  cell2: {
    padding: 4,
    paddingLeft:'6',
    color:'#331',
    fontSize: 10,
    textAlign:'left',
    fontWeight:'bold',
    fontSize:11,
    borderRight: '1 solid #f2e6ff',
    borderLeft: '0.5 solid #f2e6ff'
  },
  flexing:{
    flex:4,
    textTransform:"uppercase",
    display:'flex',
    alignContent:'center'
  },
  intStyle:{
    height:'100%',
    fontSize:'10'
  }
})
let subjects = ['CRE','ICT','AGRICULTUER', 'ENGLISH','KISWAHILI', 'MATHEMATIC','CHEMISTRY','BIOLOGY','PHYSICS','FINE ART']

const MidStandard = () => (
    <View style={[styles.page, {padding:'0',marginTop:10, position:'relative'}]}>
      <View>
        <Table>
          <TH style={{fontSize:'10'}}>
            <TD style={{flex:3}}><InfoValue text={'SUBJECT'}/></TD>
            <TD style={{flex:2}}>
              <Table>
                <TR style={{border:'0'}}><TD><InfoCenterValue text={'End of chapter'}/></TD></TR>
                <TR style={{border:'0'}}>
                  <TD><InfoCenterValue text={'C1'}/></TD>
                  <TD><InfoCenterValue text={'C2'}/></TD>
                </TR>
              </Table>
            </TD>
            <TD style={{flex:1, fontSize:'9'}}><InfoCenterValue text={'AVGE(3)'}/></TD>
            <TD style={{flex:1, fontSize:'9'}}><InfoCenterValue text={'SCORE (20%)'}/></TD>
            <TD style={{flex:1, fontSize:'9'}}><InfoCenterValue text={'SCORE (100%)'}/></TD>
            <TD style={{flex:1, fontSize:'9'}}><InfoCenterValue text={'GRADE'}/></TD>
            <TD style={{flex:2, fontSize:'9'}}><InfoCenterValue text={'ACHIVEMENT LEVEL'}/></TD>
            <TD style={{flex:1, fontSize:'9'}}><InfoCenterValue text={'TR'}/></TD>
          </TH>
          {/*  */}
          {subjects.map((sub,i)=>(
            <TR key={i}>
                <TD style={{flex:3, height:'25'}}><Text style={{paddingLeft:'3'}}>{sub}</Text> </TD>
                <TD style={{flex:1}}>
                  <TD style={{height:'100%', border:'0', paddingLeft:'5'}}><InfoCenterValue text={3.0}/></TD>
                </TD>
                <TD style={{flex:1}}>
                  <TD style={{height:'100%',border:'0', paddingLeft:'3'}}><InfoCenterValue text={9.8}/></TD>
                </TD>
                <TD style={{flex:1}}></TD>
                <TD style={{flex:1}}></TD>
                <TD style={{flex:1}}></TD>
                <TD style={{flex:1}}></TD>
                <TD style={{flex:2, fontStyle:'italic'}}><InfoValue text={'Elementary'}/></TD>
                <TD style={{flex:1}}></TD>
            </TR>
          ))}
      </Table>
      </View>
    </View>
)
export default MidStandard
