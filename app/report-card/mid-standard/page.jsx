'use client'
import { PDFViewer } from '@react-pdf/renderer'
import MidStandardReport from '@/components/MidStandardReport'
import { useRouter } from 'next/navigation'; // For App Router
import {useDataContext } from '@/context/DataProvider';
import PdfBackButton from '@/components/PdfBackButton';

export default function PDFPage() {
 const router = useRouter();
 let data = useDataContext() 
 if(!data.data_chunk){
    router.push('/home');
  }
  // 
  data.info = {...data?.school_info}
  return (
    <div className="p-6">
      <PdfBackButton selected_clas={data.selected_clas}/>
      <PDFViewer width="100%" height="750px">
        <MidStandardReport/>
      </PDFViewer>
    </div>
  )
}
