'use client'
import ALayout from "@/components/ALayout";
import PreviewStudPics from "@/components/PreviewStudPics"
import { usePathname, useRouter } from "next/navigation";
import { useDataContext } from "@/context/DataProvider";
import { useEffect, useState } from "react";
import NavBar from "@/components/Avance/NavBar";
import { getToken } from "@/utils";
import axios from "axios";
import { base_api_path } from "@/utils/reportList";
import toast from "react-hot-toast";


export default function AoneClass() {
  const {main_school_info, dispatch} = useDataContext()
  const [selected_student, setSelectedStudent] = useState([])
  const [year_of_entry, setYearOfEntry] = useState(new Date().getFullYear())
  const [geting_images_loader, setGettingImagesLoader] = useState(false)
  const [done_uploading, setDoneUploading] = useState(false)
  const [show_delete_popup, setShowDeletingPopup] = useState(false)
  const [deleting, setDeleting] = useState(false)

  //auth
  // const router = useRouter()
  // const pathname = usePathname(); 
  // useEffect(()=>{    
  //   if(main_school_info) return router.push(pathname);
  //   if(!main_school_info) return router.push('/');
  // },[])
  //
  
  //  fetch images 
  useEffect(()=>{
    async function getImages() {
      setGettingImagesLoader(prev=>!prev)
      const res = await axios.get(`${base_api_path}pics/get-photos/year-of-entry/${year_of_entry}`,{
        headers:{'Authorization':`Bearer ${getToken('access_token')}`},
      });
      dispatch({ type: 'PHOTOS', payload: res.data });
      setGettingImagesLoader(prev=>!prev)
    }
    getImages()
  }, [year_of_entry, done_uploading, deleting])
  
  //
  // 
    const handleDeletePhotos = async()=>{      
      try {
        if(selected_student.length>0){
          setDeleting(true)
          let res = await axios.delete(`${base_api_path}delete-photos`, {
          headers: {'Authorization':`Bearer ${getToken('access_token')}`
          },
          data: {image:selected_student          }
          })
          toast.success(`Deleted!!!`)
        } 
      } catch (error) {
        console.log(error);
      }finally{
        setDeleting(false)
        setSelectedStudent([])
      }   
    }
    // 
  return (
    <>
    {
      (show_delete_popup && selected_student?.length>0) && 
        <>
          <div className="bg-black fixed opacity-50" style={{zIndex:5, height:'100vh', width:'100vw'}}/>
          <div className="bg-transparent fixed overflow-hidden" style={{zIndex:5, height:'100vh', width:'100vw', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10}}>
            <div className="flex gap-3 bg-white py-10 px-10 rounded-md">
              <button onClick={handleDeletePhotos}  className="bg-gray-100 hover:bg-red-500 rounded-md transition-all duration-300 text-red-600 hover:text-white border border-red-600 text-sm px-2 hover:px-4 py-1"> Delete</button>
              <button onClick={()=>setShowDeletingPopup(prev=>!prev)}  className="bg-green-710 text-slate-800 transition-all duration-300 rounded-md text-sm py-1 px-2 border-slate-800 border hover:px-4"> Councel</button>
            </div>
          </div>
        </>
    }
    <ALayout>
      <div className="ag-theme-quartz flex-1" style={{ height: 100, width: "100%" }}>
        <NavBar heading={'PHOTO ALBUM'}/>
        <PreviewStudPics
          setSelectedStudent={setSelectedStudent}
          selected_student={selected_student}
          setYearOfEntry={setYearOfEntry}
          year_of_entry={year_of_entry}
          setDoneUploading={setDoneUploading}
          done_uploading={done_uploading}
          setShowDeletingPopup={setShowDeletingPopup}
          deleting={deleting}
        />
      </div>
    </ALayout>
    </>
  );
}
