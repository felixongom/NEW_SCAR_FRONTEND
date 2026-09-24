import Link from "next/link";
import ColorThemeSetter from "@/components/ColorThemeSetter" 
import LogoutButton from "@/components/LogoutButton"
import { BsArrowLeft } from "react-icons/bs";
import Image from "next/image";

const PageSchoolInfo = ({main_school_info }) => {
    
  return (
    <div className="w-full flex justify-between items-center border-b border-gray-300 px-2 md:px-8 py-1">
      <Link href={'/home'} className="absolute px-2 bg-gray-900 text-white rounded-full text-sm flex items-center"><BsArrowLeft className="pr-1 font-bold text-xl"/>Back</Link>
      <div className="max-w-6xlk mx-auto flex justify-between items-center h-full">

        <Image width={40} height={40} src={main_school_info?.logo ||''} alt="logo" className="object-contain" />

        <div className="flex-1 text-center px-1">
          <h1 className="text-center text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-rose-600 via-purple-600 to-pink-600 text-transparent bg-clip-text uppercase leading-tight">
            {main_school_info && main_school_info['SCHOOL NAME'] || "SCHOOL"}
          </h1>
        </div>
      </div>
      <div className="flex h-full">
        <ColorThemeSetter/>
        <LogoutButton/>
      </div>
    </div>
  );
};

export default PageSchoolInfo
