import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import {InfoCenterValue, InfoValue} from "@/components/ReportElement"
import { roundOff } from '@/utils'
import { subject_full_name } from '@/utils/reportList'
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

const SubjectDetails = ({subjects}) => {
  
  return(
    <View style={[styles.page, {padding:'0',marginTop:10, position:'relative'}]}>
      <View>
        <Table style={{borderBottom:'1'}}>
          <TH style={{fontSize:'10', height:'31', border:'1', width:'100.05%'}}>
            <TD style={{flex:3, height:'100%', borderBottom:'0'}}><InfoValue text={'SUBJECT'}/></TD>
            <TD style={{flex:3, height:'100%', border:'0'}}>
              <Table style={{height:'100%', border:0, borderLeft:'1'}}>
                <TR style={{height:'50%', borderBottom:'1'}}><TD><InfoCenterValue text={'Score for end of chapter'}/></TD></TR>
                <TR style={{border:'0', height:'50%', borderRight:'1'}}>
                  <TD style={{borderLeft:'0' }}><InfoCenterValue text={'C1'}/></TD>
                  <TD style={{borderLeft:'1'}}><InfoCenterValue text={'C2'}/></TD>
                  <TD style={{borderLeft:'1'}}><InfoCenterValue text={'Score(20)'}/></TD>
                </TR>
              </Table>
            </TD>
            <TD style={{flex:1, fontSize:'9',paddingLeft:"1", borderBottom:'0'}}><InfoCenterValue text={'EOT (80%)'}/></TD>
            <TD style={{flex:1, fontSize:'9',paddingLeft:"1", borderBottom:'0'}}><InfoCenterValue text={'TOTAL (100%)'}/></TD>
            <TD style={{flex:1, fontSize:'9', borderBottom:'0'}}><InfoCenterValue text={'GRADE'}/></TD>
            <TD style={{flex:2, fontSize:'9', borderBottom:'0'}}><InfoCenterValue text={'ACHIVEMENT LEVEL'}/></TD>
            <TD style={{flex:1, fontSize:'9', borderBottom:'0'}}><InfoCenterValue text={'TR'}/></TD>
          </TH>
          {/*  */}
          {subjects?.map((sub,i)=>{
          let is_registered = is_registered(sub['AOI'], sub['EOA(80)'])

            return !is_registered?null:(
              <TR key={i}>
                  <TD style={{flex:3, height:'25',borderBottom:'0'}}><Text style={{paddingLeft:'1'}}>{subject_full_name[sub.subject]}</Text> </TD>
                  <TD style={{flex:1}}>
                    <TD style={{height:'100%', border:'0'}}><InfoCenterValue text={roundOff(sub['A1'])}/></TD>
                  </TD>
                  <TD style={{flex:1}}>
                    <TD style={{height:'100%',border:'0'}}><InfoCenterValue text={roundOff(sub['A2'])}/></TD>
                  </TD>
                  <TD style={{flex:1, display:'flex',alignItems:'center', justifyContent:'center', borderBottom:'0'}}>{roundOff(sub['AOI(20)'],0)}</TD>
                  <TD style={{flex:1, display:'flex',alignItems:'center', justifyContent:'center', borderBottom:'0'}}>{roundOff(sub['EOA(80)'],0)}</TD>
                  <TD style={{flex:1, display:'flex',alignItems:'center', justifyContent:'center', borderBottom:'0'}}>{roundOff(sub['TOTAL'],0)}</TD>
                  <TD style={{flex:1,display:'flex',alignItems:'center', justifyContent:'center', borderBottom:'0'}}>{sub['GRADE']}</TD>
                  <TD style={{flex:2, fontStyle:'italic', borderBottom:'0'}}><InfoValue text={sub['COMM']}/></TD>
                  <TD style={{flex:1,display:'flex',alignItems:'center', justifyContent:'center', borderBottom:'0'}}>{sub['INIT']}</TD>
              </TR>
          )})}
      </Table>
      </View>
    </View>
  )
}
    

export default SubjectDetails
