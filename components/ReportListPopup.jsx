import Link from 'next/link';
import { useDataContext } from '@/context/DataProvider';


const Section = ({title, items }) => {
  const {my_subject_full_name, theme_bg} = useDataContext()
  
  if(title!='SUBJECTS'){
    return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
         
          <Link
            key={index}
            href={item.path}
            className="block bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md hover:bg-blue-50 transition"
          >
            <div className="text-gray-800 font-lg text-lg">{item.name}</div>
            <div className="text-xs text-blue-500 mt-1">{item.path}</div>
          </Link>
        ))}
      </div>
    </div>
    )

  }else{
    const subjects = Object.entries(my_subject_full_name);
    
    return (
    <div>
      <h3 style={{color:theme_bg}} className='text-center w-full font-semibold capitalize mt-3 text-2xl'>SUBJECTS</h3>
      <div className="p-6 min-h-screen">
      {/* Responsive grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {subjects.map(([code, name]) => (
          <div
            key={code}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col"
          >
            <h2 className="text-lg font-semibold text-blue-800 mb-4">
              {name}
            </h2>

            <div className="mt-auto flex justify-between">
              
              <Link
                href={`/sammury/mark-sheet/${code.toLowerCase()}`}
                className="text-green-600 hover:bg-green-600 hover:text-white rounded-lg text-sm capitalize px-2"
              >
                Class List
              </Link>
              <Link
                href={`/sammury/mark-sheet/${code.toLowerCase()}/result`}
                className="text-red-700 hover:bg-red-700 hover:text-white rounded-lg text-sm capitalize px-2"
              >
                Result
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
  } 
}
  

const ReportCardLinks = ({setShowPopUp, report_list}) => {
  
  return (
    <>
    <h3 className='text-center w-full text-purple-800 font-semibold capitalize mt-3 text-2xl'>Choose what to print here</h3>
    <div onClick={()=>setShowPopUp(prev=>!prev)} className="p-6 bg-tranparent min-h-screen">
      {Object.entries(report_list).map(([section, items], i) => (
        <Section key={section} title={section} items={items} />
        ))}
    </div>
    </>
  );
};

export default ReportCardLinks;
