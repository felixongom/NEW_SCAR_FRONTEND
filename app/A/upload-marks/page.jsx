"use client";

import ALayout from "@/components/ALayout";
import UploadMarks from "@/components/Avance/UploadMarks"
import NavBar from "@/components/Avance/NavBar";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect } from "react";
export default function AoneClass() {
  //auth
  // const router = useRouter()
  // const pathname = usePathname(); 
  // useEffect(()=>{    
  //   if(main_school_info) return router.push(pathname);
  //   if(!main_school_info) return router.push('/');
  // },[])
  //
  return (
    <ALayout>
      <div className="flex-1 pl-1">
        <NavBar heading='UPLOAD MARKS'/>
        <UploadMarks/>
      </div>
    </ALayout>
  );
}
