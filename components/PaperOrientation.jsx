
import { useDataContext } from '@/context/DataProvider';
export default function PaperOrientation({show_label=true}) {
  const {theme_bg,paper_mode, dispatch} = useDataContext()
  const mode = ['landscape', 'portrait']
  return (
    <div className='text-gray-500 text-xs'>
      {show_label && <h3 className='mb-2 font-bold'>Paper Mode</h3>}
      <div className='flex gap-1'>
      {mode.map(m=>(
        <button key={m} onClick={()=>dispatch({type:'PAPER_MODE', payload:m})}
          style={{
          backgroundColor:paper_mode===m?theme_bg:"white", 
          color:paper_mode===m?'white':theme_bg}} 
          className="text-white px-1 rounded-md transition text-xs shadow-md capitalize"
          >
            {m}
        </button>
        ))}
        </div>
    </div>
  )
}

// 
export function ResultToReport(){
  const {theme_bg, selected_exam, dispatch} = useDataContext()
  const mode = ['All', 'Exam','Aoi']
  return (
    <div className='text-gray-500 text-xs'>
      <h3 className='mb-2 font-bold'>Exam</h3>
      <div className='flex gap-1 flex-wrap'>
      {mode.map(m=>(
        <button key={m} onClick={()=>dispatch({type:'SELECTED_EXAM', payload:m})}
          style={{
          backgroundColor:selected_exam===m?theme_bg:"white", 
          color:selected_exam===m?'white':theme_bg}} 
          className="text-white px-1 rounded-md transition text-xs shadow-md capitalize"
          >
            {m}
        </button>
        ))}
        </div>
    </div>
  )
}