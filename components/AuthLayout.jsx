'use client'
import { useDataContext } from "@/context/DataProvider";
import { base_api_path } from "@/utils/reportList";
import axios from "axios";
import { useEffect } from "react";
import ChangePassword from "./ChangePassword";
import { getToken } from "@/utils";

function AuthLayout({children, router={}}) {
    const {main_school_info, dispatch} = useDataContext();

    useEffect(()=>{       
        async function fetchAuthSchool(){
            try {
                const res = await axios.get(`${base_api_path}school/auth-school`,{
                    headers:{
                        'Authorization':`Bearer ${getToken('access_token')}`
                    }
                })
                
                dispatch({ type: 'MAIN_SCHOOL_INFO', payload: res.data?.school })
                dispatch({ type: 'TOKEN', payload: local_data?.token })

                if(res.status===200) return Object.keys(router).length>0 && router.push(`/home`)
            } catch (error) {
                console.log(error); 
            } 
        }
        fetchAuthSchool() 
    },[])

   
    if(main_school_info?.password?.length===6) return <ChangePassword router={router}/>
    
    return <>{children}</>
}

export default AuthLayout