import { Table, TD, TH, TR } from '@ag-media/react-pdf-table'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import {InfoCenterValue, InfoValue} from "@/components/ReportElement"
import { paper_code, a_subject_full_name } from '@/utils/reportList'
import { getComment, getScore } from '@/utils'
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

const AOneDenseReport = ({report, set_time}) => {
  let cell_height = 25  
  
  return(
     <View style={[styles.page, {padding:'0',marginTop:10, position:'relative'}]}>
      <View>
        <Table>
          <TH style={{fontSize:'10'}}>
            <TD style={{flex:3}}><InfoValue text={'SUBJECT'}/></TD>
            <TD style={{flex:1,fontSize:'9', }}> <InfoCenterValue padding={1} text={'PAPER CODE'}/></TD>
            {set_time?.exam?.split('&').map(ex=> <TD key={ex} style={{flex:1, fontSize:'9'}}><InfoCenterValue text={ex?.trim()}/></TD>) } 
            <TD style={{flex:1, fontSize:'9'}}><InfoCenterValue text={'AVG (100%)'}/></TD>
            <TD style={{flex:1, fontSize:'9'}}><InfoCenterValue text={'LEVEL'}/></TD>
            <TD style={{flex:1, fontSize:'9'}}><InfoCenterValue text={'GRADE'}/></TD>
            <TD style={{flex:2, fontSize:'9'}}><InfoValue text={'COMMENT'}/></TD>
          </TH>
          {/*  */}
          {report.reordered.map((sub,i)=>{
            let subject = sub[0].paper.split(' ')
            let a_level_subject = ['ICT', 'HIS', 'LIT', 'AGR'].includes(subject[0])?subject[0]+'A':subject[0]
            return(
              <TR key={i}>

                <TD style={{flex:3, height:sub.lenght*cell_height}}><Text style={{paddingLeft:'3'}}>{a_subject_full_name[a_level_subject] || subject[0]}</Text> </TD>
                {/* paper code */}
                <TD style={{flex:1,height:sub.lenght*cell_height, display:'flex', flexDirection:'column'}} >
                  {sub.map((paper, j)=>(
                    <View key={j} style={{ paddingTop:"6", height:cell_height, borderBottom:(j+1)==sub.length?"0":'1', width:'100%'}}>
                      <InfoCenterValue text={paper_code[paper.paper.split(' ')[0]] + '/' + (paper.paper.split(' ')[1] || '1')}/>
                    </View>
                  ))}
                </TD>
                {/*  */}
                {set_time?.exam?.split('&').map((ex, i)=>(
                  <TD key={i} style={{flex:1,height:sub.lenght*cell_height, display:'flex', flexDirection:'column'}} >
                    {sub.map((paper, j)=>(
                      <View key={j} style={{ paddingTop:"6", height:cell_height, borderBottom:(j+1)==sub.length?"0":'1', width:'100%'}}>
                        <InfoCenterValue text={paper[ex?.trim()] || "-"}/>
                      </View>
                    ))}
                  </TD>
                ))}
                {/*  */}
                <TD style={{flex:1,height:sub.lenght*cell_height, display:'flex', flexDirection:'column'}} >
                  {sub.map((paper, j)=>(
                    <View key={j} style={{ paddingTop:"6", height:cell_height, borderBottom:(j+1)==sub.length?"0":'1', width:'100%', fontWeight:'bold'}}>
                      <InfoCenterValue text={paper.mark || "-"}/>
                    </View>
                  ))}
                </TD>
                <TD style={{flex:1,height:sub.lenght*cell_height, display:'flex', flexDirection:'column'}} >
                  {sub.map((paper, j)=>(
                    <View key={j} style={{ paddingTop:"6", height:cell_height, borderBottom:(j+1)==sub.length?"0":'1', width:'100%'}}>
                      <InfoCenterValue text={getScore(paper.grade) || "-"}/>
                    </View>
                 ))}
                </TD>
                <TD style={{flex:1}}><InfoCenterValue text={report.grade_per_subject[sub[0].paper.split(' ')[0]].letter}/></TD>
                <TD style={{flex:2, fontStyle:'italic'}}>
                  <InfoValue text={getComment(report.grade_per_subject[sub[0].paper.split(' ')[0]].letter, sub[0].paper) || "-"}/>
                </TD>
            </TR>
            )
          })}
      </Table>
      </View>
    </View>
  )
}
   

export default AOneDenseReport
