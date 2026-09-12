'use client'
import { PDFViewer } from '@react-pdf/renderer'
import ZitoReport from '@/components/ZitoReport';
import { DataProvider, useDataContext } from '@/context/DataProvider';
import { useRouter } from 'next/navigation'; // For App Router
import { useSearchParams } from 'next/navigation';
import PdfBackButton from '@/components/PdfBackButton';

export default function PDFPage() {
  let data = useDataContext()  
  const searchParams = useSearchParams();
    const BOT = searchParams.get('BOT');
    const MOT = searchParams.get('MOT');
    const EOT = searchParams.get('EOT');
  
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
          <ZitoReport exm={{BOT,MOT,EOT}} data ={data}/>
        </DataProvider>
      </PDFViewer>
    </div>
  )
}
