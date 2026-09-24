import { useDataContext } from "@/context/DataProvider";
import { uploadLogo } from "@/utils";
import Image from "next/image";

const LogoPreviewer = () => {
  const {dispatch, token, school_info, logo, main_school_info} = useDataContext()
  
  return (
    <div className="p-1 mx-auto flex-col border-b-1 flex justify-center items-center">
      <div className="h-[120px] w-[120px] flex flex-wrap relative">
          <Image
            width={120} 
            height={120} 
            src={logo || main_school_info?.logo}
            alt="logo"
            style={{
            margin: '5px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            objectFit: 'cover',
            padding:3,
            }}
          />
          <input 
              className="cursor-pointer" 
              type="file" 
              style={{ width: '120px', height: '120px',objectFit: 'cover',position:"absolute", opacity:0}}
              accept="image/*" 
              onChange={(e)=>uploadLogo(e, dispatch, school_info, main_school_info.sscar_code, token)}
            />
         
      </div>
      <h1 className="w-full text-center font-semibold text-gray-600 text-sm">{school_info?.sscar_code}</h1>
    </div>
  );
};

export default LogoPreviewer;
