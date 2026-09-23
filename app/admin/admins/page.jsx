'use client'

import ColorThemeSetter from "@/components/ColorThemeSetter"
import { useDataContext } from "@/context/DataProvider"
import {brightness} from "color-tin"
import AdminLinks from "@/components/Admin/AdminLinks"
import axios from "axios"
import { base_api_path } from "@/utils/reportList"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AdminList({}){
 const {theme_bg}=useDataContext()
 const [users, setUsers] = useState([])
 const [is_changing, setIsChanging] = useState(false)
 //
 useEffect(()=>{
    async function fetchUser() {
        const res =  await axios.get(`${base_api_path}admin/users`)        
        setUsers(res?.data?.users)  
    }
    fetchUser()
},[is_changing])
//  
async function changeStatus(id, status){
    setIsChanging(prev=>!prev)  
    try {
        await axios.patch(`${base_api_path}admin/user/${id}/status/${status}`)        
    } catch (error) {
        console.log(error);
    }finally{
        setIsChanging(prev=>!prev) 
    }
     
 }
//  
async function deleteUser(id){
    setIsChanging(prev=>!prev)  
    try {
        if(users.length>1){
            await axios.delete(`${base_api_path}admin/users/${id}/delete`)        
        }
    } catch (error) {
        console.log(error);
    }finally{
        setIsChanging(prev=>!prev) 
    }
     
 }
 
 
    return(
        <div className="p-2 ">
            <div className="flex justify-between pb-1">
                <AdminLinks/>
                <ColorThemeSetter/>
            </div>
            <hr className="my-1" style={{height:2, background:'#fff'}} />
            <div className="w-full h-full mt-2">
                <table className="w-full border-collapse rounded-md overflow-hidden shadow-md text-sm">
                    <thead style={{backgroundColor:`${theme_bg}`, color:brightness(theme_bg)<65?"white":'black'}} className={`text-white`}>
                        <tr>
                            <th className="p-1 text-left flex-1 text-sm">#</th>
                            <th className="p-1 text-left flex-3 text-sm">Admin&apos;s Name</th>
                            <th className={`p-1 text-left flex-1 text-sm`}>Email</th>
                            <th className="p-1 text-left flex-1 text-sm">Password</th>
                            <th className="p-1 text-center flex-1 text-sm">Status</th>
                            <th className="p-1 text-center flex-1 text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                    {users?.map((user, index) => (
                        <tr
                        key={index}
                        className={`border-t hover:bg-gray-100 transition duration-800 text-gray-800 `}
                        style={{height:35}}
                        >
                        <td className="p-1 flex-2 text-sm flex-1 ">{index+1}</td>
                        <td className="p-1 flex-2 text-sm flex-1 capitalize">{user.username}</td>
                        <td className={`p-1 text-left'} text-sm flex-1`}>{user.email}</td>
                        <td className="p-1 text-sm flex-1">{user.password}</td>
                        <td ><button 
                            onClick={()=>changeStatus(user.id, !user.is_active)} 
                            className={`text-center text-sm px-2 pointer ${user.is_active?"bg-green-500":"bg-red-500"} rounded-md text-white text-xs`}>
                            {user.is_active?(is_changing?"Disabling...":"Enabled"):(is_changing?"Enabling...":"Disabled")}
                            </button></td>

                        
                        <td className="p-1 flex flex-row gap-2 flex-1 justify-center">
                            <button
                                onClick={()=>deleteUser(user.id)}
                                className="bg-red-500 text-white px-1 rounded-md transition text-xs">
                                {is_changing? "Deleting...":"Delete"}
                            </button>
                            <Link href={`/admin/add-admins?id=${user.id}&username=${user.username}`}
                                onClick={()=>{}}
                                className="bg-orange-800 text-white px-1 rounded-md transition text-xs">
                                Update
                            </Link>
                        </td>
                        </tr>
                    ))}
                    </tbody>
    </table>
            </div>
        </div>
    )
}