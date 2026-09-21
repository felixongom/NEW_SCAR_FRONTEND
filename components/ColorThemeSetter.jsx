import { useDataContext } from "@/context/DataProvider";
import { colors } from "@/utils/reportList";
import { useState } from "react";

function ColorThemeSetter() {
  const {theme_bg, dispatch } = useDataContext()
  // 
  const [toggleTheme, setToggleTheme] = useState(false)
  const handleTheme = (color)=>{
    setToggleTheme(prev=>!prev)
    if(typeof color ==='string'){
      dispatch({type:'THEME', payload:color})
      localStorage.setItem('theme_bg', color)
    }else{
      dispatch({type:'THEME', payload:color.target.value})
      localStorage.setItem('theme_bg', color.target.value)

    }
  }

  return (
    <div className={`${toggleTheme?'w-40':'w-15'} h-[100%] mx-1`}>
        <button style={{backgroundColor:`${theme_bg}`}} onClick={()=>setToggleTheme(prev=>!prev)} className="px-1 font-semibold text-white rounded cursor-pointer text-xs">App theme</button>
        {toggleTheme && (
            <div className="w-full flex flex-wrap gap-1">
              {
                colors.map(color=>(<div onClick={()=>handleTheme(color)} style={{cursor:'pointer',width:25, height:25, borderRadius:'10%', color:`${color.text}`, backgroundColor:`${color}`}}></div>))
              }
            <input type="color" onChange={(e)=>handleTheme(e)} value={theme_bg} style={{width:25, height:25, borderRadius:'10%'}}/>
          </div>)}
        </div>
  )
}

export default ColorThemeSetter