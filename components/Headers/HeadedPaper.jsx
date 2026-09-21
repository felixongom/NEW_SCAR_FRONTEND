import { useDataContext } from "@/context/DataProvider";
import { base_api_path } from "@/utils/reportList";
import { capitalize } from "@/utils/reshpe_data";

export function HeadedPaper({pics, learner_pic, subject_name}){
    const { main_school_info} = useDataContext(); 
    
    return (
        <div className="w-full py-1 bg-white relative">
            <div className="text-lg flex justify-between px-2 py-1 w-full">
                <img width={120} height={120} src={main_school_info.logo} />
                <div className="flex justify-center flex-col">
                    <h1 className="text-center text-4xl font-bold -mt-3">{main_school_info['SCHOOL NAME']}</h1>
                    <span className="text-center text-[20px] -mt-2">{main_school_info['BOX NO']}, {main_school_info['DISTRICT/CITY']}</span>
                    {main_school_info['DISTRICT/CITY'] && <i className="text-center text-sm font-semibold italic capitalize -mt-2">{capitalize(main_school_info['CAMPUS'])} Campus</i>}
                    <p className="text-center font-semibold text-sm">
                        Email:<i className="text-center font-normal">{main_school_info['EMAIL']}</i> |
                        Tel:<i className="text-center font-normal">{main_school_info['PHONE']}</i>
                    </p>
                    <p className="text-center text-sm -mt-1 font-normal">{main_school_info['LOCATION']}</p>
                    <i className="text-center text-sm font-semibold capitalize -mt-1">" {capitalize(main_school_info['MOTO'])} "</i>
                </div>
                {subject_name?<div className="text-6xl mt-3">{subject_name}</div>:learner_pic?<img className="w-[100px] h-[120px]" src={base_api_path.replace('/api', '')+'uploads/'+learner_pic} />:
                    pics?<img width={120} height={120} src={pics} />:
                <div/>}
            </div>
            <div className="w-full pt-2">
                <HorizontalDoubleLine/>
            </div>
        </div>
    )
}

export function HorizontalDoubleLine(){
    const { theme_bg } = useDataContext(); 
    return(
        <div className="w-full absolute bottom-0">
            <div className="h-[7px] w-full border-0 mb-[4px]" style={{ backgroundColor: theme_bg }}/>
            <div className="h-[1px] w-full border-0 border-white" style={{ backgroundColor: theme_bg }}/>
        </div>
    )
}