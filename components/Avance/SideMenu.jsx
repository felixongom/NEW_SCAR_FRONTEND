'use cliet'

import Link from "next/link"
import {nav_links} from "@/utils/reportList"
import { useDataContext } from "@/context/DataProvider";
import { usePathname } from "next/navigation";
import {brightness} from 'color-tin'
import { useEffect } from "react";
import { MdChevronLeft } from "react-icons/md";


export default function SideMenu(){
    const pathname = usePathname(); 
    const {theme_bg, toggle_manu, dispatch} =useDataContext();
    // 
      useEffect(()=>{
        let theme = localStorage.getItem('theme_bg')
        if(theme){
          dispatch({type:'THEME', payload:theme})
         }
        },[])
    //
    
    return(
        <div className={`${!toggle_manu?'w-[220px]':'w-[0px]'} transition-all duration-100 ease-in-out shadow-sm h-[100vh] print:hidden border-r border-gray-300`} style={{zIndex:5}}>
            <div className={`${!toggle_manu?'w-[220px]':'w-[0px] overflow-x-hidden'} transition-all duration-100 h-[100vh] bg-white fixed left-0 `}>
                <li className="list-none w-full pl-1 relative"
                    style={{
                        height:80,
                        margin:'auto',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'left',
                        borderBottom:'1px solid #f2f2f2',
                        background:theme_bg,
                        color:`${(brightness(theme_bg)<60?"white":'#1a1a1a')}`,
                        fontWeight:"bold",
                }}>
                    <Link href={''} className={`text-l w-full flex`}> <img src="" className="mr-1"/> {'MHS542BW'}</Link>
                    <span className='flex justify-center items-center p-1 h-[25px] w-[25px] bg-gray-200 top-1 absolute right-1 cursor-pointer rounded-full' onClick={()=>dispatch({type:'TOGGLE_MENU', payload:!toggle_manu})}>
                        <MdChevronLeft className=' text-gray-900 text-xl font-semibold absolute' />
                    </span>
                </li>
                {nav_links.map((link, i)=>(
                        <li key={i} className={`list-none w-full py-3 px-1 cursor-pointer rounded-${pathname  === link.path? 'md': null}`}
                            style={{
                                // height:45,
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'left',
                                borderBottom:'1px solid #ddd',
                                background:`${pathname  === link.path? theme_bg: "#fff"}`,
                                color:`${pathname  === link.path?(brightness(theme_bg)<60?"white":'#1a1a1a'):'#1a1a1a'}`,
                                fontWeight:`${pathname  === link.path? "bold":'normal'}`,
                            }} 
                        >
                        <Link href={link.path} className={`text-sm w-full flex`}> <span className="mr-1 text-xl">{link.icon}</span> {link.name}</Link>
                        </li>
                ))}
                
            </div>
        </div>
    )
}