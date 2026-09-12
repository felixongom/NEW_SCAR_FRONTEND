"use client";
import {brightness} from "color-tin"
import { useDataContext } from "@/context/DataProvider";
import { reshapeGradeTostring } from "@/utils/reshpe_data";
import { useState } from "react";
import axios from "axios";
import { base_api_path } from "@/utils/reportList";
import { getToken } from "@/utils";

export default function AddGrade({ sscar_code, isSubsidiary, range, grade, setGrade, editRange}) {
    const {theme_bg} = useDataContext()  
    const [isSending, setIsSending] = useState(false)  
    let grade_data = reshapeGradeTostring(sscar_code,isSubsidiary, grade);
    // 
    
    async function sendGrade(e){
      e.preventDefault()
      setIsSending(true)
      try {
      let res = await axios.post(`${base_api_path}school/add-school-grade`,{
          ...grade_data,
          grade_str:grade_data.grade,
        },
        {headers:{'Authorization':`Bearer ${getToken('access_token')}`}}) 
        console.log(res);
        
        setIsSending(false)
      } catch (error) {
        console.log(error);
        setIsSending(false)
        
      }
    }
   
    return(
        <form onSubmit={sendGrade} className="mt-5  bg-white shadow-sm rounded p-1">
        <div className="flex gap-11 ">
          <h1>Add {isSubsidiary} grading</h1>
          <div onClick={()=>setGrade([...grade, {...range, i:grade.reverse()[0].i+1}])} className="shadow-2xl text-center cursor-pointer" style={{fontSize:20, height:30, width:30, borderRadius:'50%',background:theme_bg, color:brightness(theme_bg)<60?"#fff":theme_bg}}> + </div>
        </div>
        {/*  */}
        <div className=" flex pt-3 font-bold text-sm" style={{}}>
          <div className="" style={{width:'33.33%'}}>Lower limit</div>
          <div className="" style={{width:'33.33%'}}>Upperer limit</div>
          <div className="" style={{width:'33.33%'}}>Grade</div>
        </div>
        {grade.map((g, i)=>(
        <div key={i} className=" flex w-full text-sm mt-2" style={{}}>
          <div className="" style={{width:'33.33%'}}> <input type="number" className="border py-1 px-2" onChange={(e)=>editRange(e,{...g ,name:'lower_limit'})} value={g.lower_limit } /> </div>
          <div className="" style={{width:'33.33%'}}> <input type="number" className="border py-1 px-2"  onChange={(e)=>editRange(e,{...g ,name:'upper_limit'})} value={g.upper_limit} /> </div>
          <div className="" style={{width:'33.33%'}}> <input type="number" className="border py-1 px-2"  onChange={(e)=>editRange(e,{...g ,name:'grade'})} value={g.grade}/> </div>
        </div>
        ))}
        <button disabled={isSending?true:false} className="mt-3 rounded cursor-pointer px-10 text-sm" style={{background:theme_bg, color:brightness(theme_bg)<60?"#fff":theme_bg}}>{isSending?"Saving...":"Save"}</button>
      </form>
    )
}
