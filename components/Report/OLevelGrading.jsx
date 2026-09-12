import { useDataContext } from "@/context/DataProvider";
export default function OLevelGading(){
    const {gradings} = useDataContext()  
    return (
        <table className='w-full'>
            <tr className='border border-gray-500 text-sm'>
                <th className='border border-gray-500 px-1 text-center'>SCORE RANGE</th>
                <th className='border border-gray-500 px-1 text-center'>GRADE</th>
                <th className='border border-gray-500 px-1'>ACHIEVEMENT LEVEL</th>
                <th colSpan={4} className='border border-gray-500 px-1'>GRADE DESCRIPTOR</th>
            </tr>
            {Object.keys(gradings?.olevel_grade ||{}).map((range, i)=>{
                return(
                <tr className='border border-gray-500  text-sm'>
                    <td className='border border-gray-500 px-1 text-center italic'>{range}</td>
                    <td className='border border-gray-500 px-1 text-center italic'> {gradings.olevel_grade[range]} </td>
                    <td className='border border-gray-500 px-1 italic'> {gradings.olevel_comment[gradings.olevel_grade[range]]} </td>
                    <td colSpan={4} className='border border-gray-500 px-1 italic'>{gradings.olevel_descriptor[gradings.olevel_grade[range]]} </td>
                </tr>
            )})}
        </table>
    )
}