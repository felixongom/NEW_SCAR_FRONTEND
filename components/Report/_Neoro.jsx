import { Table, TD, TR } from '@ag-media/react-pdf-table'
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
    <View style={[styles.page, {padding:'0',marginTop:10, position:'relative', width:'100%'}]}>
      {/* Table head */}
      <View style={{fontWeight:'bold',display:'flex',flexDirection:'row', width:'100%', border:'1', height:'30'}}>
        <View style={{flex:3, height:'100%', paddingTop:'7'}}>
          <InfoValue text={'SUBJECTS'}/>
        </View>
        {/*  */}
        <View style={{ flex:3, height:'100%', flexDirection:'column'}}>
          <Text style={{display:'flex', alignItems:'center', padding:'3', justifyContent:'center', width:'100%', textAlign:'center', borderLeft:'1'}}>END OF CHAPTER</Text>
          <Table style={{borderLeft:'0'}}>
            <TR style={{height:'15', borderLeft:'0'}}>
              <TD><InfoCenterValue text={'C1'}/></TD>
              <TD><InfoCenterValue text={'C2'}/></TD>
              <TD style={{fontSize:'09', borderLeft:'0'}}><InfoCenterValue text={'SCORE(20)'}/></TD>
            </TR>
          </Table>
        </View>
        {/*  */}
        <View style={{flex:3, height:'100%'}}>
          <Table>
            <TR style={{height:'100%', fontSize:'9'}}>
              <TD ><InfoCenterValue text={'EOA (80)'}/></TD>
              <TD><InfoCenterValue text={'TOTAL (100)'}/></TD>
              <TD style={{fontSize:'09', borderRight:'0'}}><InfoCenterValue text={'GRADE'}/></TD>
            </TR>
          </Table>
        </View>
        {/*  */}
        <View style={{flex:3, height:'100%'}}>
          <Table>
            <TR style={{height:'100%', fontSize:'9'}}>
              <TD style={{flex:'3'}}><InfoCenterValue text={'ACHIEVEMENT LEVEL'}/></TD>
              <TD style={{flex:'1'}}><InfoCenterValue text={'TR'}/></TD>
            </TR>
          </Table>
        </View>
      </View>
      {/* Table Body */}
      {subjects?.map((subject, i)=>{
        return(
          <View key={i} style={{display:'flex',flexDirection:'row', width:'100%', border:'1', height:'20', borderTop:'0'}}>
          <View style={{flex:3, height:'100%', paddingTop:'3'}}>
            <InfoValue text={subject_full_name[subject.subject]}/>
          </View>
          {/*  */}
          <View style={{ flex:3, height:'100%', flexDirection:'column'}}>
            <Table>
              <TR style={{height:'27', borderLeft:'1'}}>
                <TD style={{borderBottom:'0', borderLeft:'0'}}><InfoCenterValue text={roundOff(subject['A1'],1)}/></TD>
                <TD><InfoCenterValue text={roundOff(subject['A2'],1)}/></TD>
                <TD style={{fontSize:'09', borderRight:'0'}}><InfoCenterValue text={roundOff(subject['AOI(20)'],0)}/></TD>
              </TR>
            </Table>
          </View>
          {/*  */}
          <View style={{flex:3, height:'100%'}}>
            <Table>
              <TR style={{height:'100%'}}>
                <TD ><InfoCenterValue text={roundOff(subject['EOA(80)'],0)}/></TD>
                <TD><InfoCenterValue text={roundOff(subject['TOTAL'],0)}/></TD>
                <TD style={{borderRight:'0'}}><InfoCenterValue text={subject['GRADE']}/></TD>
              </TR>
            </Table>
          </View>
          {/*  */}
          <View style={{flex:3, height:'100%'}}>
            <Table>
              <TR style={{height:'100%'}}>
                <TD style={{flex:'3'}}><InfoValue text={subject['COMM']}/></TD>
                <TD style={{flex:'1'}}><InfoCenterValue text={subject['TOTAL']?subject['INIT']:''}/></TD>
              </TR>
            </Table>
          </View>
        </View>
        )
      }  
      )}
    </View>
  )
}
    

export default SubjectDetails
