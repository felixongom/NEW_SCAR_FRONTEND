import { useDataContext } from "@/context/DataProvider";
export default function OLevelGading({font_size=null}){
    const {gradings, selected_clas} = useDataContext()  
    let clas = parseInt(selected_clas.split(' ')[1])
    let grades = clas<5?gradings?.o_level:gradings?.a_level
    const ranges = Object.keys(grades?.grade|| {})?.reverse() 
    
    return (
        clas>4?
        <div className="w-full">
            <h5 className="font-semibold">PRNCIPLE SUBJECTS</h5>
            <table className='w-full'>
            <tr className={`border border-gray-500 text-${font_size}`}>
                <td className='border border-gray-500 px-1 text-left w-[18%] font-semibold'>SCORE RANGE</td>
                {ranges?.map(range=>(
                    <td key={range} className='border border-gray-500 px-1 text-center'>{range}</td>
                ))}
            </tr>
            <tr className={`border border-gray-500 text-${font_size}`}>
                <td className='border border-gray-500 px-1 text-left font-semibold'>GRADE</td>
                {ranges.map(range=>(
                    <td key={range} className='border border-gray-500 px-1 text-center'>{grades?.grade[range]}</td>
                ))}
            </tr>
            <tr className={`border border-gray-500 text-${font_size}`}>
                <td className='border border-gray-500 px-1 text-left font-semibold'>PRNCIPLE POINTS</td>
                {ranges.map(range=>(
                    <td key={range} className='border border-gray-500 px-1 text-center'>{grades?.points[grades.grade[range]]}</td>
                ))}
            </tr>
            </table>
            
            <h5 className="font-semibold mt-2">SUBSIDIARY SUBJECTS</h5>
            <table className="w-2/5 border">
                <tr className={`border border-gray-500 text-${font_size}`}>
                    <td className="text-left font-semibold border border-gray-500 p-1">SCORE RANGE</td>
                    <td className="border border-gray-500 text-center">0.00 - 2.49</td>
                    <td className="border border-gray-500 text-center">2.50 - 5.00</td>
                </tr>
                <tr className={`border border-gray-500 text-${font_size}`}>
                    <td className="text-left font-semibold border border-gray-500 p-1">GRADE</td>
                    <td className="border border-gray-500 text-center">F</td>
                    <td className="border border-gray-500 text-center">P</td>
                </tr>
            </table>

        </div> :
        <table className='w-full'>
            <tr className={`border border-gray-500 text-${font_size}`}>
                <th className={`border border-gray-500 px-1 text-center ${!font_size?'py-2':''}`}>SCORE RANGE</th>
                <th className='border border-gray-500 px-1 text-center'>GRADE</th>
                <th className='border border-gray-500 px-1'>ACHIEVEMENT LEVEL</th>
                <th colSpan={4} className='border border-gray-500 px-1'>GRADE DESCRIPTOR</th>
            </tr>
            {Object.keys(grades?.grade ||{}).map((range, i)=>{

                return(
                <tr key={i} className={`border border-gray-500 text-${font_size}`}>
                    <td className={`border border-gray-500 px-1 text-center italic ${!font_size?'py-2':''}`}>{range}</td>
                    <td className='border border-gray-500 px-1 text-center italic'> {grades?.grade[range]} </td>
                    <td className='border border-gray-500 px-1 italic'> {grades?.comment[grades.grade[range]]} </td>
                    <td colSpan={4} className='border border-gray-500 px-1 italic'>{grades.descriptor[grades.grade[range]]} </td>
                </tr>
            )})}
        </table>
    )
}