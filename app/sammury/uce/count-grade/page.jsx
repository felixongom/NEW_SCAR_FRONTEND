'use client'
import { PDFViewer } from '@react-pdf/renderer'
import CountEachUnebUceGrade from '@/components/uce/CountEachUnebUceGrade'
import { DataProvider, useDataContext } from '@/context/DataProvider';
import { useRouter } from 'next/navigation'; // For App Router
import PdfBackButton from '@/components/PdfBackButton';

export default function PDFPage() {
  const data = useDataContext()
  const router = useRouter();
  if(!data?.uneb_uce){
    router.push(`/uneb-uce?clas=${data.selected_clas}`);
  }
  // 
  return (
    <div className="p-6">
      <PdfBackButton selected_clas={data.selected_clas}/>
      <PDFViewer width="100%" height="750px">
        <DataProvider>
         <CountEachUnebUceGrade data = {data}/>
        </DataProvider>
      </PDFViewer>
    </div>
  )
}