import Link from "next/link";
import { useEffect} from "react";
import ColorThemeSetter from "@/components/ColorThemeSetter" 
import LogoutButton from "@/components/LogoutButton"

const PageSchoolInfo = ({dispatch, main_school_info }) => {
      
      // useEffect(()=>{
      //   let theme = localStorage.getItem('theme')
      //   if(theme){
      //     dispatch({type:'THEME', payload:JSON.parse(theme)})
      //   }
      // },[])

 
  return (
    <div className="w-full flex border-b border-gray-300 px-8 py-1 cyan">
      <Link href={'/home'} className="absolute px-2 bg-gray-900 text-white rounded-lg text-sm">Back</Link>
      <div className="max-w-6xlk mx-auto flex justify-between items-center h-full">
        {/* Logo */}
        <div className="w-[50px] h-[50px]">
          <img src={main_school_info?.logo} alt="School Logo" className="w-full h-full object-contain" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-center text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text uppercase leading-tight">
            {main_school_info && main_school_info['SCHOOL NAME'] || "School Name"}
          </h1>
          <p className="text-sm tracking-wide text-gray-600 font-bold italic capitalize">{main_school_info && main_school_info['BOX NO'] && <span> {main_school_info['BOX NO']}, </span>}
            {main_school_info['DISTRICT/CITY'] && <span>{main_school_info['DISTRICT/CITY']} </span>}</p>
        </div>
      </div>
      <div className="flex gap-2 h-full">
        <ColorThemeSetter/>
        <LogoutButton/>
      </div>
    </div>
  );
};

export default PageSchoolInfo
