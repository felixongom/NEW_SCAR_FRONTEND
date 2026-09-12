'use client'
import { PDFViewer } from '@react-pdf/renderer';
import MarkSheet from '../../../../components/MarkSheet';
import { useDataContext } from '@/context/DataProvider';
import { reportOneSubject } from '@/utils/reshpe_data';
import { useRouter } from 'next/navigation'; // For App Router
import _ from 'lodash';
import PdfBackButton from "@/components/PdfBackButton"; 


export default function PDFPage({params}) {
  const data = useDataContext()
  // 
  const router = useRouter();
  if(!data.data_chunk){
    router.push(`/one-class?clas=${data.selected_clas}`);
  }
  // 
  let result = reportOneSubject(_.orderBy(data.ranked_data,['STREAM', 'STUDENT NAME'],['asc','asc']), params.subject.toUpperCase())
  data.info = {...data?.school_info}
  
  return (
    <div className="p-6">
      <PdfBackButton selected_clas={data.selected_clas}/>
      <PDFViewer width="100%" height="750px">
        <MarkSheet data={data} result = {result} subject={params.subject==='*'?' ':params.subject}/>
      </PDFViewer>
    </div>
  )
}
