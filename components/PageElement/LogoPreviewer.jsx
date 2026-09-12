import { useDataContext } from "@/context/DataProvider";
import { uploadLogo } from "@/utils";

const LogoPreviewer = () => {
  const {dispatch, token, school_info, logo, main_school_info} = useDataContext()
  
  return (
    <div className="p-6 mx-auto flex-col border-b-2 flex justify-center align-middle">
      <div style={{height:'120px',width:'120px', display: 'flex', flexWrap: 'wrap', marginTop: '3px', position:'relative'}}>
          <img
            src={logo || main_school_info?.logo}
            alt="logo"
            style={{
            width: '120px',
            height: '120px',
            margin: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            objectFit: 'cover',
            padding:3,
            position:"absolute"
            }}
          />
          <input 
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
