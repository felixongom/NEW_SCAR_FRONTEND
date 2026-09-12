import { useState } from "react";
import "ldrs/react/Ring.css"
import {Ring} from "ldrs/react"
import { useDataContext } from "@/context/DataProvider";
import { getToken, numbersArray } from "@/utils";
import {colorTin, brightness} from "color-tin"
import { base_api_path } from "@/utils/reportList";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import toast from "react-hot-toast";
import ExportPaycode from '@/hooks/useExportPaycode'

export function StudentUpdateComponent({student,setShowStudentPopup,updating,setUpdating}) {
    const {theme_bg} = useDataContext()
    const [student_data, setSudentData]=useState({
        name:student['STUDENT NAME'],
        sex:student['SEX'], 
        stream:student['STREAM'],
        pay_code:student.pay_code,
        level:student.level,
    })
    // 
    const updateStudent = async(e)=>{
        e.preventDefault()
        const {name, sex} = student_data
        if(name && sex){
            // 
            try {
                setUpdating(prev=>!prev)
                let result = await axios.patch(`${base_api_path}edit-student/${student?.id}`,
                    {...student_data},
                    { headers: { Authorization: `Bearer ${getToken('access_token')}` } },
                );
                console.log(result);
                setUpdating((prev) => !prev);
            } catch (error) {
                setUpdating((prev) => !prev);
            }finally{
                setUpdating(false);
            }
        }
    }
    
    return(
        <>
        <div className="absolute w-full h-full bg-black opacity-70 z-10"/>
        <div className="absolute pt-1 shadow-lg w-full h-full z-10 overflow-hidden">
            <form className="relative shadow-lg bg-white rounded p-3 overflow-hidden lg:w-1/2 md:w-3/4 w-5/6 m-auto flex flex-col gap-2">
                <button className="bg-gray-300 hover:bg-red-400 font-semibold px-1 py-1 w-8 h-8 rounded absolute top-1 right-1"  onClick={()=>setShowStudentPopup(null)}>x</button>
                <Title text={'EDIT - ' + student['STUDENT NAME']}/>
                <div className="w-full flex py-1 flex-col">
                    <label className="text-xs pb-1 text-gray-400">Full Name</label>
                    <input value={student_data.name} onChange={(e)=>setSudentData({...student_data,name:e.target.value})} className="text py-2 px-1 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs" />
                </div>
                <div className="w-full flex py-1 flex-col">
                    <label className="text-xs pb-1 text-gray-400">Sex</label>
                    <input value={student_data.sex} onChange={(e)=>setSudentData({...student_data,sex:e.target.value})} className="text py-2 px-1 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs" />
                </div>
                <div className="w-full flex py-1 flex-col">
                    <label className="text-xs pb-1 text-gray-400">Stream</label>
                    <input value={student_data.stream} onChange={(e)=>setSudentData({...student_data,stream:e.target.value})} className="text py-2 px-1 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs"  />
                </div>
                <div className="w-full flex py-1 flex-col">
                    <label className="text-xs pb-1 text-gray-400">Pay Code</label>
                    <input value={student_data.pay_code} onChange={(e)=>setSudentData({...student_data,pay_code:e.target.value})} className="text py-2 px-1 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs" />
                </div>
                <div className="w-full flex py-1 flex-col">
                    <label className="text-xs pb-1 text-gray-400">Level ('A' OR 'O'))</label>
                    <input value={student_data.level} onChange={(e)=>setSudentData({...student_data,level:e.target.value})} className="text py-2 px-1 border border-gray-300 focus:border-blue-500 focus:outline-none text-xs" />
                </div>
                <div onClick={updateStudent} className="w-full mx-auto mt-2 rounded flex justify-center" style={{backgroundColor:theme_bg}}>
                    {updating?<Ring size={30} stroke={5} bgOpacity={0} speed={2} color="white"/>:
                    <button className="bg-transparent w-full h-full text-white py-2">Save</button>
                    }
                </div>
            </form>
        </div>
    </>
    )
}

// Coppying enrolment from previous exam
export function StudentEnorolementComponent({subjects,setShowEnrolemetPopup}) {
    const {theme_bg} = useDataContext()
    const [selected_subject, setSelectedSubject] = useState([])
    const [from, setFrom] = useState({year:new Date().getFullYear(),clas:1, term:1, exam:'BOT'})
    const [to, setTo] = useState({year:new Date().getFullYear(), clas:1, term:1, exam:'BOT'})
    const [saving, setSaving] = useState(false)
    
    // 
    const saveEnrolement = async()=>{
        if(!(saving || selected_subject.length===0)){
            // 
            try {
                setSaving(prev=>!prev)
                let result = await axios.post(`${base_api_path}copy-exam-enrolement`,
                    {
                        from:{...from, paper_id:selected_subject}, 
                        to:{...to, paper_id:selected_subject},},
                    { headers: { Authorization: `Bearer ${getToken('access_token')}` } },
                );
                setSaving((prev) => !prev);
                if(result.data) {
                    toast.success(`Copying Completed!`)
                }
            } catch (error) {
                setSaving((prev) => !prev);
                toast.error(`Failed to copy`)
            }finally{
                setSaving(false);
            }
        }
    }

    // 
    function SelectSubject(subject_id){
    
        let exist = selected_subject.includes(subject_id)
        if(!exist){
            setSelectedSubject([...selected_subject, subject_id])
        }else{
            let remove = selected_subject.filter(subj=>subj!==subject_id)
            console.log(remove);
            setSelectedSubject(remove)
        }
    }
    
    return(
        <>
        <div className="absolute w-full h-full bg-black opacity-70 z-10"/>
        <div className="absolute pt-1 shadow-lg w-full h-full z-10 overflow-hidden">
            <div className="relative shadow-lg bg-white rounded p-3 overflow-hidden lg:w-3/4 w-full h-[98vh] m-auto flex flex-col gap-2">
                <button className="bg-gray-300 hover:bg-red-400 font-semibold px-1 py-1 w-8 h-8 rounded absolute top-1 right-1"  onClick={()=>setShowEnrolemetPopup(prev=>!prev)}>x</button>
                <Title text={'COPPY ENROLEMENT FROM PREVIOUS '}/>
                <h4 className="text-teal-700 font-semibold text-center">SELECT A SUBJECT/PAPER</h4>
                <div className="flex flex-wrap gap-1 border-b border-gray-300 w-full pb-1">
                    {subjects && Object.keys(subjects)?.map((subject, i)=>{
                        const paper_id = parseInt(subjects[subject])
                        return(
                            <button 
                            key={i}
                            className={`px-2 rounded-sm text-sm text-gray-800 bg-gray-300`}
                            onClick={()=>SelectSubject(paper_id)} 
                            style={{
                                backgroundColor:selected_subject.includes(paper_id)?theme_bg:null,
                                color:selected_subject.includes(paper_id)?'#fff':null,
                                fontWeight:selected_subject.includes(paper_id)?'bold':null,
                            }}
                             >{subject}</button>
                        )
                    })}
                </div>
                {saving && <div>
                    <h4 className="text-center m-auto text-red-800 py-1 px-5 rounded-full bg-gray-100 w-fit">Pleas wait, this can take sometimes...</h4>
                    </div>}
                {/*  */}
                <div className="flex justify-center gap-1 md:gap-3 lg:gap-5 w-full">
                    <DetailsCard title={'FROM'} current_year={from.year} detail={from} setDetail={setFrom}/>
                    <DetailsCard title={'TO'} current_year={to.year} detail={to} setDetail={setTo}/>
                </div>
                <div onClick={saveEnrolement} className="w-1/2 mx-auto mt-2 rounded flex justify-center" style={{backgroundColor:theme_bg}}>
                {saving? 
                    <Ring size={30} stroke={5} bgOpacity={0} speed={2} color="white"/>:
                    <button className="bg-transparent w-full h-full text-white py-2">Save</button>
                }
              </div>
            </div>
        </div>
    </>
    )
}
// Coppying enrolment from previous exam
export function ExportPaycodeComponet({selected_student,isUploading,setIsUploading,setShowPaycodePopup}) {
    const {theme_bg } = useDataContext()    
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
   
    
    // Directly handles file selection and immediate upload
    const handleUploadPaycode = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        if (!selectedFiles.length) return;
    
        setIsUploading(true);
        setProgress(0);
        setMessage("");
    
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("file", file); // Change "files" to "file" if backend expects singular
        });
    
        try {
          const res = await axios.post(`${base_api_path}upload-excel?sheet1=PAY CODES`, formData, {
            headers: {
              'Authorization': `Bearer ${getToken('access_token')}`
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setProgress(percent);
              }
            },
          });
          if(res.data===true){

          }
    
          setMessage(`${selectedFiles.length} file${selectedFiles.length>1?'s':''} uploaded successfully!`);
        } catch (error) {
          setMessage("Upload failed. Please try again.");
        } finally {
          setIsUploading(false);
          e.target.value = ""; // Reset file input so selecting the same file again triggers onChange
        }
    };
    
    return(
        <>
        <div className="absolute w-full h-full bg-black opacity-70 z-10"/>
        <div className="absolute pt-1 shadow-lg w-full h-full z-10 overflow-hidden">
            <div className="relative  shadow-lg bg-white rounded overflow-hidden lg:w-3/4 w-full h-[98vh] m-auto flex flex-col gap-2">
                <button className="bg-gray-300 text-xs md:text-sm hover:bg-red-500 font-semibold px-1 py-1 w-8 h-8 rounded absolute top-1 right-1"  onClick={()=>setShowPaycodePopup(prev=>!prev)}>x</button>
                <div style={{backgroundColor:theme_bg}} className="text-white py-2 px-2">EXPORT PAY CODE TO EXCEL</div>
                <div className="w-full px-2 pt-5 flex justify-center">
                    <ExportPaycode
                     selected_student={selected_student}
                    />
                </div>
                <form className="flex justify-center items-center mt-5 w-full flex-col border-1 rounded m-auto border-t border-gray-400">
                    <h3 className="text-center w-1/2 font-bold mx-auto pt-5" style={{color:theme_bg}}>UPLOAD PAY CODE</h3>
                    <div className="w-1/2 m-auto">
                        <input
                            type="file"
                            accept=".xlsx,.xlsm, .xls"
                            onChange={handleUploadPaycode}
                            className="block w-full cursor-pointer mt-6 bg-gray-200 hover:bg-gray-300 text-black text-sm p-2 rounded-full file:bg-gray-100 file:text-pink-700 file:px-2 file:border-1 file:rounded-full file:border-pink-700"
                        />
                    </div>
                    <div className="px-2 py-5 w-1/2 flex justify-center flex-col items-center">
                        {/* indicators */}
                        {isUploading && (
                            <p className="text-xs text-slate-500 mb-2">Uploading Pay code...</p>
                        )}

                        {progress > 0 && (
                            <div className="w-full bg-gray-200 rounded h-3 my-2">
                            <div
                                className="h-3 rounded text-white text-xs flex items-center justify-center transition-all duration-200"
                                style={{ width: `${progress}%`, backgroundColor: theme_bg || '#be185d' }}
                            >
                                {progress}%
                            </div>
                            </div>
                        )}

                        {message && (
                            <p className={`mt-2 text-sm ${message.includes("failed") ? "text-red-600" : "text-green-600"}`}>
                            {message}
                            </p>
                        )}

                    </div>
                </form>
            </div>
        </div>
    </>
    )
}

// enrolemnt details card
function DetailsCard({title, current_year, detail, setDetail}) {
    const {theme_bg} = useDataContext()
    let years_list = numbersArray(10, current_year-5).reverse() //[2025,2026,2027,2028,2029,2030 ]
    const [open_year, setOpenYear] = useState(false)
    let exam_list = detail.clas >4? ['BOT', 'MOT','EOT']:['BOT', 'MOT','EOT','EOC', 'A1', 'A2', 'A3', 'A4', 'A5']
    let classes = [1, 2, 3, 4, 5, 6]

    return(
        <div className="shadow p-2 flex justify-center flex-col">
            <h5 style={{color:theme_bg}} className="pb-1 border-b-2 border-teal-600 font-bold text-center">{title}</h5>
            {/* year */}
            <div className="w-full h-full pt-5">
                <div className="flex gap-1 pb-5 text-sm">
                    <label>Year:</label>
                    <div className="relative">
                        <div className='flex gap-3 font-bold' style={{color:theme_bg}}>
                            <span>{current_year}</span>
                            <span onClick={()=>setOpenYear(pre=>!pre)} className='font-semibold cursor-pointer'>
                                <IoIosArrowDown />
                            </span>
                        </div>
                        {open_year && 
                    <div className='flex flex-col absolute z-10'>
                        {years_list.map(year=>(
                            <span 
                                style={{background:current_year===year?theme_bg:'#e6e6e6',
                                fontWeight:current_year===year?'bold':'',
                                color:`${current_year===year?(brightness(theme_bg)<70?"white":'black'):'black'}`
                                }}
                                onClick={()=>setDetail({...detail, year:year})} 
                                  className='border border-blue-500" bg-white px-2 py-1 cursor-pointer text-sm'>{year}</span>
                        ))}
                    </div>}
                </div>
                </div>  
            </div>
            {/* CLASS */}
            <div className="flex gap-1 text-sm py-5 border-t border-gray-300">
                Class:
                {
                    classes.map(c=>(
                        <button
                        style={{
                            background:`${detail.clas  === c? theme_bg: "#e6e6e6"}`,
                            color:`${detail.clas  === c?(brightness(theme_bg)<60?"white":'#1a1a1a'):'#1a1a1a'}`,
                            fontWeight:`${detail.clas  === c? "bold":'normal'}`,
                        }} 
                        className="cursor-pointer px-1 gap-1 rounded" onClick={()=>setDetail({...detail, clas:c})} 
                        key={c}
                        
                        >S{c}</button>
                    ))
                }
            </div>
            {/*  */}
            <div className="flex gap-1 text-sm py-5 border-t border-gray-300">
                <label>Term:</label>
                {[1,2,3].map(trm=>(
                    <span onClick={()=>setDetail({...detail, term:trm})} 
                    className='cursor-pointer ml-1 py-0 px-1 rounded' key={trm}
                    style={{
                        background:detail.term===trm?theme_bg:'#e6e6e6',
                        fontWeight:detail.term===trm?'bold':'',
                        color:`${detail.term===trm?(brightness(theme_bg)<70?"white":'black'):'black'}`
                    }}
                    >{trm}</span >
                    ))}
            </div>
            {/*  */}
            <div className="flex gap-1 py-5 border-t border-gray-300">
                <label className='relative'>Exam:</label>
                {exam_list.map(exam=>(
                <button onClick={()=>setDetail({...detail, exam})} 
                    className='cursor-pointer ml-1 py-0 px-1 rounded text-sm' key={exam}
                    style={{
                        height:19,
                        background:detail.exam===exam?theme_bg:'#e6e6e6',
                        fontWeight:detail.exam===exam?'bold':'',
                        color:`${detail.exam===exam?(brightness(theme_bg)<70?"white":'black'):'black'}`
                    }}
                >{exam}</button >))}

            </div>

        </div>

    )
        
        // 
        
    }

    // title
export function Title({text=''}){
    const {theme_bg} = useDataContext()
    let colors = colorTin(theme_bg, 10)
    return(
        <h3 style={{backgroundColor:colors.lighter_90, color:theme_bg, border:`1px solid ${theme_bg}`}} className="text-sm m-auto rounded-lg px-4 py-2 my-2 text-center font-bold w-fit">{text}</h3>
    )
}
    // title
export function ChangeExanAllAoiEoc(){
    const {dispatch, set_time, reserve_exam} = useDataContext()

    return(<div className="flex justify-center gap-2 bg-white">
        {[reserve_exam, 'AOI', 'EOC'].map(exam=>{
            return(
            <button onClick={()=>dispatch({type:"SET_TIME", payload:{...set_time, exam:exam=='ALL'?reserve_exam:exam}})} className={`px-3 py-0 h-[30px] rounded-full border border-slate-900 shadow-sm text-sm transition-all duration-100 ${exam===set_time.exam?'bg-gray-700 font-semibold text-white':'white'}`}>{exam}</button>
        )})}
    </div>)
}