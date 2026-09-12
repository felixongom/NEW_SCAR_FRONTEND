'use client'
import { PDFViewer } from '@react-pdf/renderer'
import ClassGrade from '../../../components/ClassGrade'
import { DataProvider, useDataContext } from '@/context/DataProvider';
import AClassGrade from '@/components/AClassGrade';
import { useRouter } from 'next/navigation'; // For App Router
import PdfBackButton from '@/components/PdfBackButton';

export default function PDFPage() {
  const data = useDataContext()
  const router = useRouter();
  if(!data.data_chunk && !(data.selected_clas==='SENIOR 5'|| data.selected_clas==='SENIOR 6')){
    router.push('/A/enroled');
  } else if(!data.data_chunk && !(data.selected_clas==='SENIOR 1'|| data.selected_clas==='SENIOR 2' || data.selected_clas==='SENIOR 3'|| data.selected_clas==='SENIOR 4')){
    router.push(`/one-class?clas=${data.selected_clas}`);
  }
  return (
    <div className="p-6">
      <PdfBackButton selected_clas={data.selected_clas}/>
      <PDFViewer width="100%" height="750px">
        <DataProvider>
         
         {(data.selected_clas==='SENIOR 5' || data.selected_clas==='SENIOR 6')?<AClassGrade is_marks={true} hide_grade={true} data ={data}/> :
          <ClassGrade is_marks={true} data ={data}/>}
        </DataProvider>
      </PDFViewer>
    </div>
  )
}
