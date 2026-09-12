'use client'

import AdminLinks from "@/components/Admin/AdminLinks"
import ColorThemeSetter from "@/components/ColorThemeSetter"
import { useDataContext } from "@/context/DataProvider"
import { base_api_path } from "@/utils/reportList"
import axios from "axios"
import {brightness} from "color-tin"
import { useEffect, useState } from "react"

export default function Schools({}){
    const {theme_bg}=useDataContext()
    const [schools, setSchools] = useState([])
    const [is_changing, setIsChanging] = useState(false)
    const [editedSchool, setEditedSchool]= useState('')
    //
    useEffect(()=>{
        async function fetchSchools() {
            const res =  await axios.get(`${base_api_path}school/schools`)        
            setSchools(res?.data.school)  
        }
        fetchSchools()
    },[is_changing])

    // change school status
    async function changeSchoolStatus(id, status){
        setIsChanging(true)
        let res
        try {
            if(!editedSchool){
                res =  await axios.patch(`${base_api_path}school/${id}/status/${!status}`)
            }else{
                res =  await axios.patch(`${base_api_path}school/add-active-time`, {
                    ...editedSchool,
                    is_admin:true
                })
                setEditedSchool(false)
            }
        } catch (error) {
        console.log(error);
            
        }finally{
            setIsChanging(false)
        }
    }

    return(
        <div className="p-2 ">
            <div className="flex justify-between pb-3">
                <AdminLinks/>
                <ColorThemeSetter/>
            </div>
            <hr className="my-3" style={{height:2, background:'#fff'}} />
            <div className='flex w-full flex-row justify-between mb-3'>
                <input onChange={(e) => {}} className='px-2 border focus:border-0 text-xs py-1' type="text" placeholder='Search school' />
            </div>
            <div className="w-full h-full">
                <table className="w-full border-collapse rounded-md  overflow-x-scroll shadow-md text-xs">
                    <thead style={{backgroundColor:`${theme_bg}`, color:brightness(theme_bg)<65?"white":'black'}} className={`text-white`}>
                        <tr>
                            <th className="p-1 text-left text-xs">#</th>
                            <th className="p-1 text-left text-xs">School</th>
                            <th className="p-1 text-left text-xs">Campus</th>
                            <th className="p-1 text-left text-xs">Logo</th>
                            <th className={`p-1 text-left text-xs`}>Sscar Code</th>
                            <th className="p-1 text-left text-xs">Password</th>
                            <th className="p-1 text-left text-xs">Time left</th>
                            <th className="p-1 text-left text-xs">Status</th>
                            <th className="p-1 text-center text-xs">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {schools.map((school, index) => (
                        <tr
                        key={index}
                        className={`border-t hover:bg-gray-100 transition duration-800 text-xs text-gray-700 bg-${index%2===1?"gray-50":"white"} ${school.time_left==='time passed'?'text-red-500':''}`}
                        >
                        <td className="p-1 text-xs capitalize">{index+1}</td>
                        <td className={`p-1 text-left' text-xs capitalize`}>{school.school.slice(0,30)}</td>
                        <td className={`p-1 text-left' text-xs capitalize`}>{school.campus||'--'}</td>
                        <td className={`p-1 text-left' text-xs capitalize`}> <img src={school.logo} width={35} height={35} alt="logo"/> </td>
                        <td className={`p-1 text-left' text-xs capitalize`}>{school.sscar_code}</td>
                        <td className="p-1 text-xs">{school.password.length<35? school.password:'--'}</td>
                        <td className={`p-1 text-xs`}>{school.time_left}</td>
                        <td className="p-1 text-left text-xs" >
                            <input value={editedSchool.id===school.id? editedSchool.amount:''} onChange={(e)=>setEditedSchool({id:school.id,sscar_code:school.sscar_code, amount:e.target.value})} className="px-1 w-[60px] mr-1 text-xs border" type="text" placeholder="eg: 1000" />
                            <button onClick={()=>changeSchoolStatus(school.id, school.is_active)} className={`px-2 pointer bg-${school.is_active?"green":"red"}-500 rounded-md text-white text-xs`}>
                                {school.is_active?(is_changing?"Disabling...":"Enabled"):(is_changing?"Enabling...":"Disabled")}
                            </button>
                        </td>

                        
                        <td className="p-1 flex flex-row gap-2 justify-center items-center">
                            <button
                                onClick={()=>{}}
                                className="bg-red-500 text-white px-1 rounded-md transition text-xs">
                                Delete
                            </button>
                            <button
                                onClick={()=>{}}
                                className="bg-orange-800 text-white px-1 rounded-md transition text-xs">
                                Update
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                 </table>
            </div>
        </div>
    )
}