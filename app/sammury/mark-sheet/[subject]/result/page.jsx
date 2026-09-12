'use client'
import { PDFViewer } from '@react-pdf/renderer'
import SubjectResult from '../../../../../components/SubjectResult'
import { useDataContext } from '@/context/DataProvider'
import PdfBackButton from '@/components/PdfBackButton'

// 
export default function PDFPage({params}) {
  const data = useDataContext()
  // 
  data.info = {...data?.school_info}
  return (
    <div className="p-6">
      <PdfBackButton selected_clas={data.selected_clas}/>
      <PDFViewer width="100%" height="750px">
        <SubjectResult subject={params.subject}/>
      </PDFViewer>
    </div>
  )
}
