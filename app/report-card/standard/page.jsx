'use client'
import { PDFViewer } from '@react-pdf/renderer'
import StandardReport from '@/components/StandardReport';
import { DataProvider, useDataContext } from '@/context/DataProvider';
import { useRouter } from 'next/navigation'; // For App Router
import PdfBackButton from '@/components/PdfBackButton';

export default function PDFPage() {
  let data = useDataContext() 
  let localStorageData = localStorage.getItem('importantData')
  if(localStorageData){
    let local_data = JSON.parse(localStorageData) 
    data.begins = local_data?.begins
    data.ends = local_data?.ends
    data.put_position = local_data?.put_position
  }
  

  const router = useRouter();
  if(!data.data_chunk){
    router.push('/home');
  }
  // 
  data.info = {...data?.school_info}
  return (
    <div className="p-6">
      <PdfBackButton selected_clas={data.selected_clas}/>
      <PDFViewer  width="100%" height="750px">
        <DataProvider>
          <StandardReport data ={data}/>
        </DataProvider>
      </PDFViewer>
    </div>
  )
}
