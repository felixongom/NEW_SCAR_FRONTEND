import Loading from "@/app/A/enroled/loading";
import { useDataContext } from "@/context/DataProvider";
import {brightness} from "color-tin"
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import _ from "lodash"


export default function AEnroleStudents({students,setShowStudentPopup, set_student_loading, selected_student, setSelectedStudent, colors}) {
  const {theme_bg } = useDataContext()
  const [search_student, setSearchStudent] = useState(students);
  const [sort_column, setSortColumn]= useState({})

  const toggleStudent = (id) => {
    if(id===true){
      let ids = students.map(student=>student.id)
      selected_student.length?setSelectedStudent([]):setSelectedStudent(ids)
    }else{
      setSelectedStudent((prev) =>prev.includes(id)? prev.filter((x) => x !== id): [...prev, id]);
    }
  }

  const searchStudents = (search_term)=>{
    const filtered = _.filter(students, item =>
      item['STUDENT NAME']?.toLowerCase().includes(search_term.toLowerCase()) ||
      item['learner_id']?.toLowerCase().includes(search_term) ||
      item['STREAM']?.toLowerCase() === search_term
    )    
    setSearchStudent(filtered)
  } 
  //
   // 
  const sortData = (column)=>{
    const active_column = sort_column[column]=='asc'?'desc':'asc'
    setSortColumn({[column]:active_column})
  }
  const class_list = _.orderBy(search_student, [Object.keys(sort_column)[0]], [Object.values(sort_column)[0]])
    
  return (
      <div className="mx-auto max-w-7xls p-1 relative w-full">
        {/* Card */}
        {set_student_loading && <Loading/>}
        <div className="overflow-hidden bg-white shadow-lg">
          {/* Header */}
          <div className="border-b flex gap-4 p-2 py-3 text-white" style={{backgroundColor:theme_bg}}>
            <h2 className="text-sm font-bold">
              Class Size <span 
              style={{backgroundColor:colors.lighter_40}}
              className="mt-1 text-xs py-1 px-2 rounded-lg text-white font-thin">{students?.length} </span>
            </h2>
            <input onChange={(e) => searchStudents(e.target.value)} className='px-2 py-1 focus:border-0 text-xs border-collapse text-gray-700 border border-gray-300 focus:border-gray-500 focus:outline-none' type="text" placeholder='Search student . . . ' />
            <button className="px-2 py-0 text-xs text-center" style={{backgroundColor:colors.lighter_30}}>{selected_student?.length} selected</button>
          </div>

          {/* Desktop Table */}
          <div className="overflow-x-auto md:block">
            <table className="min-w-full">
              <thead
                style={{
                  color: brightness(theme_bg) < 65 ? theme_bg : "black",
                  borderBottom: `2px solid ${theme_bg}`
                }}
               className="bg-gray-100 text-gray-700 font-regular">
                <tr style={{color:theme_bg}} className="font-semibold  text-sm md:text-[15px] font-mono">
                  <td className="text-left px-1 py-1">
                    #
                  </td>

                  <td className="flex pl-1 py-1">
                    <button
                      style={{borderColor:selected_student.length?theme_bg:'#999'}}
                      onClick={() => toggleStudent(true)}
                      className={`flex h-4 w-4  items-center justify-center border transition
                      ${selected_student.length? "border-green-600": "border-gray-500"}`}>
                      {selected_student.length ? <span className="h-2 w-2 rounded-sm" style={{backgroundColor:theme_bg}}/>:null}
                    </button>   
                  </td>

                  <td className="text-left">
                    STUDENT NO.
                  </td>

                  <td onClick={()=>sortData('STUDENT NAME')} className="text-left cursor-pointer">
                    STUDENT NAME
                  </td>

                  <td onClick={()=>sortData('SEX')} className="text-center cursor-pointer">
                    GENDER
                  </td>
                  <td onClick={()=>sortData('STREAM')} className="text-center cursor-pointer">
                    STREAM
                  </td>
                  <td className="text-center">
                    L PASSWORD
                  </td>
                  <td className="text-center">
                    P PASSWORD
                  </td>
                  <td className="text-center">
                    PAY CODE
                  </td>
                  <td className="flex gap-2 text-center cursor-pointer">
                    ACTION
                  </td>

                </tr>
              </thead>

              <tbody>
                {class_list.map((student, index) => (
                  <tr
                    style={{
                      backgroundColor:selected_student.includes(student.id)? colors.lighter_70: "white",
                      backgroundColor:selected_student.includes(student.id)? colors.lighter_70: index%2==1?'#f2f2f2':'white',
                      borderBottom:selected_student.includes(student.id)?'1px solid #fff':`${(class_list?.length-1 ===index)?'2px solid '+theme_bg:'1px solid '+colors.lighter_70}`
                    }}
                    key={index}
                    className={`border-b transition text-sm md:text-[15px] font-mono font-thin text-gray-800 border-gray-300 border-1 hover:bg-indigo-50`}
                  >

                    <td className="px-1 py-2">
                      {index+1}
                    </td>
                        
                    <td className="px-1 py-2">
                      <button
                          style={{borderColor:selected_student.includes(student.id)?theme_bg:'#999'}}
                          onClick={() => toggleStudent(student.id)}
                          className={`flex h-4 w-4  items-center justify-center border transition`}>
                          {selected_student.includes(student.id) ? <span className="h-2 w-2 rounded-sm" style={{backgroundColor:theme_bg}}/>:null}
                      </button> 
                    </td>

                    <td className="px-1 py-2">
                      {student.learner_id}
                    </td>

                    <td className="px-1 py-2">
                      {student['STUDENT NAME']}
                    </td>

                    <td className="px-1 py-2 text-center">
                      {student["SEX"] && 
                    student["SEX"]?.toUpperCase()==='FEMALE'?'F':student["SEX"]?.toUpperCase()==='MALE'?'M':student["SEX"]?.toUpperCase()}
                    </td>
                    <td className="px-1 py-2 text-center">
                      {student['STREAM']}
                    </td>
                    <td className="px-1 py-2 text-center">
                      {student['learner_password']}
                    </td>
                    <td className="px-1 py-2 text-center">
                      {student['parent_password']}
                    </td>
                    <td className="px-1 py-2 text-center">
                      {student['pay_code']?student['pay_code']:'-'}
                    </td>
                    <td className="flex gap-2 px-1 py-2">
                      <button className="h-[25px] w-[25px] bg-gray-200 rounded-md flex justify-center items-center text-center hover:bg-gray-700 text-yellow-500 hover:text-white">
                        <FaRegEdit onClick={()=>setShowStudentPopup(student)} className="cursor-pointer"/> 
                      </button>
                      {/* <FaRegEye EyclassName="cursor-pointer text-gray-4000"/>  */}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      </div>
  );
}