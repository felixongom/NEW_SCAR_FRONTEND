import { useDataContext } from "@/context/DataProvider";
export default function OLevelGading({font_size=""}){
    const {gradings, selected_clas} = useDataContext()  
    let clas = parseInt(selected_clas.split(' ')[1])
    let grades = clas<5?gradings?.o_level:gradings?.a_level
    const ranges = Object.keys(grades?.grade|| {})?.reverse() 
    
    return (
        clas>4?
         <table className='w-full'>
            <tr className={`border border-gray-500 text-${font_size}`}>
                <td className='border border-gray-500 px-1 text-left w-[12%]'>SCORE RANGE</td>
                {ranges?.map(range=>(
                    <td key={range} className='border border-gray-500 px-1 text-center'>{range}</td>
                ))}
            </tr>
            <tr className={`border border-gray-500 text-${font_size}`}>
                <td className='border border-gray-500 px-1 text-left'>GRADE</td>
                {ranges.map(range=>(
                    <td key={range} className='border border-gray-500 px-1 text-center'>{grades?.grade[range]}</td>
                ))}
            </tr>
            <tr className={`border border-gray-500 text-${font_size}`}>
                <td className='border border-gray-500 px-1 text-left'>POINTS</td>
                {ranges.map(range=>(
                    <td key={range} className='border border-gray-500 px-1 text-center'>{grades?.points[grades.grade[range]]}</td>
                ))}
            </tr>
            <tr className={`border border-gray-500 text-${font_size}`}>
                <td className='border border-gray-500 px-1 text-left'>COMMENT</td>
                {ranges.map(range=>(
                    <td key={range} className='border border-gray-500 px-1 text-center'>{grades?.comment[grades.grade[range]]}</td>
                ))}
            </tr>
        </table> :
        <table className='w-full'>
            <tr className={`border border-gray-500 text-${font_size}`}>
                <th className='border border-gray-500 px-1 text-center'>SCORE RANGE</th>
                <th className='border border-gray-500 px-1 text-center'>GRADE</th>
                <th className='border border-gray-500 px-1'>ACHIEVEMENT LEVEL</th>
                <th colSpan={4} className='border border-gray-500 px-1'>GRADE DESCRIPTOR</th>
            </tr>
            {Object.keys(grades?.grade ||{}).map((range, i)=>{

                return(
                <tr key={i} className={`border border-gray-500 text-${font_size}`}>
                    <td className='border border-gray-500 px-1 text-center italic'>{range}</td>
                    <td className='border border-gray-500 px-1 text-center italic'> {grades?.grade[range]} </td>
                    <td className='border border-gray-500 px-1 italic'> {grades?.comment[grades.grade[range]]} </td>
                    <td colSpan={4} className='border border-gray-500 px-1 italic'>{grades.descriptor[grades.grade[range]]} </td>
                </tr>
            )})}
        </table>
    )
}