import { Table, TD, TR } from '@ag-media/react-pdf-table'
import {InfoCenterValue} from "@/components/ReportElement"
import { Text } from '@react-pdf/renderer'
import { roundOff } from '@/utils';

function OverallAchivement({report, is_aoi}) {
    
  return (
    <Table style={{marginTop:'10', fontSize:'10'}}>
        <TR>
          <TD style={{flex:3, paddingTop:'2', paddingBottom:'2', display:'flex', flexDirection:'column', justifyContent:'center'}}>
            <Text>OVERALL</Text>
            <Text>ACHIEVEMENT</Text>
          </TD>
          <TD style={{flex:3}}>
            <Table style={{border:'0'}}>
              <TR style={{borderBottom:'1', paddingTop:2, paddingBottom:2}}>
                <TD ><InfoCenterValue text={`TOTAL SCORE(${report.expexted_total})`}/></TD>
              </TR>
              <TR style={{borderBottom:'0',paddingTop:2,paddingBottom:2}}>
                <TD ><InfoCenterValue text={roundOff(is_aoi?report['MID TOTAL(100)']:report['TOTAL'],0)}/></TD>
              </TR>
            </Table>
          </TD>
          <TD style={{flex:3}}>
            <Table style={{border:'0'}}>
              <TR style={{borderBottom:'1', paddingTop:2,paddingBottom:2}}>
                <TD><InfoCenterValue text={'AVERAGE SCORE(100%)'}/></TD>
              </TR>
              <TR style={{borderBottom:'0',paddingTop:2,paddingBottom:2}}>
                <TD><InfoCenterValue text={roundOff(is_aoi?(report['MID AVG(20)']*100/20):report['AVG'])}/></TD>
              </TR>
            </Table>
          </TD>
          <TD style={{flex:1}}>
            <Table style={{border:'0'}}>
              <TR style={{borderBottom:'1', paddingTop:2,paddingBottom:2}}>
                <TD><InfoCenterValue text={'GRADE'}/></TD>
              </TR>
              <TR style={{borderBottom:'0', paddingTop:2,paddingBottom:2}}>
                <TD><InfoCenterValue text={is_aoi?report['MID AVG GRADE']:report['AVG GRADE']}/></TD>
              </TR>
            </Table>
          </TD>
          <TD style={{flex:3}}>
            <Table style={{border:'0'}}>
              <TR style={{borderBottom:'1', paddingTop:2,paddingBottom:2}}>
                <TD><InfoCenterValue text={'DESCRIPTOR'}/></TD>
              </TR>
              <TR style={{borderBottom:'0',paddingTop:2,paddingBottom:2}}>
                <TD><InfoCenterValue text={is_aoi?report['MID COMM']:report['COMM']}/></TD>
              </TR>
            </Table>
          </TD>
        </TR> 
      </Table>
  )
}

export default OverallAchivement