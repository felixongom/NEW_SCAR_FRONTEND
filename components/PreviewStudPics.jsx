'use client';

import { useDataContext } from '@/context/DataProvider';
import { useEffect, useState } from 'react';
import { base_api_path } from '../utils/reportList';
import axios from 'axios';
import { IoIosArrowDown } from 'react-icons/io';
import { getToken, numbersArray } from '@/utils';
import {brightness,colorTin} from 'color-tin'
import toast from 'react-hot-toast';
import { MdOutlineLocalPrintshop } from 'react-icons/md';
import { HeadedPaper } from './Headers/HeadedPaper';
import { Title } from './StudentUpdateComponent';
import { Ring } from 'ldrs/react';

const UploadImages = ({setDoneUploading,year_of_entry,setYearOfEntry,selected_student, setSelectedStudent,setShowDeletingPopup, geting_images_loader, deleting}) => {
  const {theme_bg, photos, selected_clas} = useDataContext()

  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [ready_photo, setReadyPhotos] = useState(photos);
  const [openYear, setOpenYear] = useState(false)
  const [search, setSearch] = useState('')

  // 
  useEffect(()=>{
    const filtered = _.filter(photos,(item) =>
        item['image']?.toLowerCase().includes(search.toLowerCase())
      );      
      setReadyPhotos(filtered)
  },[search])
  // 
  let years_list = numbersArray(10, year_of_entry-5).reverse() //[2025,2026,2027,2028,2029,2030 ]
 
  const handleChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setProgress(0);
    e.target.files = null
  };


const handleUpload = async () => {
  if (!files.length) return;

  let formData = new FormData();
  files.forEach((file) => {
    formData.append('file', file);
  });

  // attache rewuest body
  try {
    setDoneUploading(prev=>!prev)
    const res = await axios.post(`${base_api_path}pics/uploads`, formData, {
      headers:{'Authorization':`Bearer ${getToken('access_token')}`},
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        }
      },
    });
    if(res.data===true){ 
      toast.success(`Done Uploading Photos`)
    }else{
      toast.error(`Failed to Upload Photos`)
    }
    setDoneUploading(prev=>!prev)
    setProgress(0);
  } catch (error) {
    console.log(error);
    
    alert('Upload failed.');
  }
};
// 
  const changeYearOfEntry = (year)=>{
    setYearOfEntry(year)
    setOpenYear(pre=>!pre)
  }
  // 

    const toggleStudent = (image) => {
    if (image === true) {
      let img = ready_photo.map((photo) => photo.image);
      if(selected_student.length>0){
        setSelectedStudent([])
      }else{
        setSelectedStudent(img);
      }
    } else {
      setSelectedStudent((prev) =>
        prev.includes(image) ? prev.filter((x) => x !== image) : [...prev, image],
      );
    }
  };
  
  
  let colors = colorTin(theme_bg, 10);
  const visible_photos = ready_photo.length===0?photos:ready_photo
  return (
    <div className="p-4 w-full mx-auto">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="mb-2 print:hidden block mt-6 bg-gray-100 hover:bg-gray-300 cursor-pointer text-black text-sm p-2 rounded-full file:bg-gray-100 file:outline-none file:text-pink-700 file:px-2 file:border-1 file:rounded-full file:border-pink-700"
      />

      <button
        onClick={handleUpload}
        disabled={!files.length}
        className="py-1 px-2 print:hidden rounded-lg border border-slate-800 hover:bg-slate-700 hover:px-3 shadow-sm text-sm transition-all duration-100 bg-slate-700 cursor-pointer font-semibold text-white">
        Upload
      </button>

      {progress > 0 && 
      (
        <div className="mt-6 md:w-[30vw] w-[80vh]">
          <p className="text-sm mb-1">Uploading: {progress}%</p>
          <div className="w-full bg-gray-300 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )} 
      {/* album */}
      {/* Header */}
      <div className="w-full hidden print:block print:-mt-2">
        <HeadedPaper/>
        <Title text={`${selected_clas } PHOTO ALBUM`}/>
      </div>
      <div className="pt-3">
        <div className='flex justify-between py-3 border-t print:hidden'>
          <h2 className="text-sm md:text-xl font-bold text-gray-700">Photo Album{geting_images_loader && <Ring size={30} stroke={2} bgOpacity={0} speed={2} color="#f3f3f3"/>}</h2>
          {/* YEAR OF ENTRY */}
          <div className="flex justify-between p-2 ">
            <div className="flex gap-1 pb-2 text-sm">
              <label className='font-bold '>Year of Entry:</label>
              <div className="relative">
                <div className='flex gap-3 font-bold' style={{color:theme_bg}}>
                  <span>{year_of_entry}</span>
                  <span onClick={()=>setOpenYear(pre=>!pre)} className='font-semibold cursor-pointer'>
                    <IoIosArrowDown />
                  </span>
                 </div>
                {openYear && 
                  <div className='flex flex-col absolute z-10'>
                    {years_list.map(year=>(
                      <span 
                      key={year}
                        style={{background:year_of_entry===year?theme_bg:'#e6e6e6',
                        fontWeight:year_of_entry===year?'bold':'',
                        color:`${year_of_entry===year?(brightness(theme_bg)<70?"white":'black'):'black'}`
                        }}
                        onClick={()=>changeYearOfEntry(year)} 
                        className='border border-blue-500" bg-white px-2 py-1 cursor-pointer text-sm'>{year}</span>
                     ))}
       
                </div>
              }
              </div>
            </div>      
          </div>

          {/*  */}
        </div>
        <div className='flex justify-between mb-2 gap-2 print:hidden'>
          <button 
            onClick={() => toggleStudent(true)}
            className={`${photos.length===selected_student.length && selected_student.length>0 ?'bg-slete-800 text-white':'bg-white text-slate-800'} ml-aut text-sm flex px-2 rounded-sm items-center justify-center border transition bg-white border-gray-500`}
            >SELECT ALL
          </button>
          <div className='flex gap-2'>
            <button onClick={()=>setShowDeletingPopup(prev=>!prev)}  className={`${!selected_student.length>0?'hidden':null} bg-gray-100 text-rose-700 rounded border-rose-900 border-1 text-sm px-3`}>
              Delete {deleting &&  <Ring size={15} stroke={2} bgOpacity={0} speed={2} color="red"/>}
            </button>
            <button
              style={{borderColor: theme_bg,borderWidth:1,color: theme_bg}}
              onClick={() => print()}
              className="flex gap-1 px-1 rounded transition text-xs md:text-sm"
              > 
                <MdOutlineLocalPrintshop style={{fontSize:18}}/> <span className="font-xs">Page</span>
            </button>
          </div>
           
        </div>
        <div
        className="border-b flex gap-4 p-2 py-3 text-white"
        style={{ backgroundColor: theme_bg }}
        >
        <h2 className="text-sm font-bold">
          Class Size{" "}
          <span
            style={{ backgroundColor: colors.lighter_40 }}
            className="mt-1 text-xs py-1 px-2 rounded text-white font-thin"
          >
            {photos?.length}{" "}
          </span>
        </h2>
        <input
          onChange={(e) => setSearch(e.target.value)}
          className="px-2 py-1 focus:border-0 text-xs border-collapse text-gray-700 print:hidden"
          type="text"
          placeholder="Search student . . ."
        />
        <button
          className="px-2 py-0 text-xs text-center print:hidden"
          style={{ backgroundColor: colors.lighter_30 }}
        >
          {selected_student?.length} selected
        </button>
      </div>
      <div className="flex gap-4 flex-wrap justify-left pt-2">
        {[...visible_photos,
          
        ]?.map((photo, index) => (
          <div
            key={index}
            className="bg-white w-[130px] rounded shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >
            <div className="w-full h-36 relative bg-gray-100 flex items-center justify-center">
              <img
                title={base_api_path.replace('/api', '')+'uploads/'+photo.image}
                lazy
                src={base_api_path.replace('/api', '')+'uploads/'+photo.image}
                alt={photo.image}
                className="w-full h-full hover:scale-125 object-cover transition"
              />
              <button 
                style={{borderColor: true ? theme_bg : "#999"}}
                onClick={() => toggleStudent(photo.image)}
                className={`flex h-3.5 w-3.5 absolute top-1 right-1 items-center justify-center border transition bg-white print:hidden`}
              >
                {selected_student.includes(photo.image) ? <span className="h-2 w-2"style={{ backgroundColor: theme_bg }}/>:null}
              </button>
            </div>
            <div style={{color:  theme_bg}} className="text-center text-sm font-bold text-gray-800">
              {photo.image.match(/^__(.*?)[\[(]/)?.[1] || ""}
            </div>
            <div className="text-center text-xs font- text-gray-800">
              {photo.image_id}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default UploadImages;
