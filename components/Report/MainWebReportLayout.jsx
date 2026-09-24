"use client";
import { useDataContext } from "@/context/DataProvider";
import { IoDocumentTextOutline } from 'react-icons/io5';
import { MdOutlineSummarize, MdOutlineDocumentScanner } from "react-icons/md";

import{colorTin} from 'color-tin'
import { TfiPrinter, TfiArrowLeft } from "react-icons/tfi";
import ColorThemeSetter from '../ColorThemeSetter';
import LogoutButton from '../LogoutButton';
import Link from 'next/link';

export default function MainWebReportLayout({children}) {
  const {theme_bg, dispatch,report_category} = useDataContext()

  let colors = colorTin(theme_bg, 10);
  const main_category = [
    {report_type:'report summary', icon:<MdOutlineSummarize style={{color:theme_bg}} className="text-3xl mt-1 text-gray-500"/>},
    {report_type:'general summary', icon:<MdOutlineDocumentScanner style={{color:theme_bg}} className="text-3xl mt-1 text-gray-500"/>}, 
    {report_type:'report cards', icon:<IoDocumentTextOutline style={{color:theme_bg}} className="text-3xl mt-1 text-gray-500"/>}, 
  ]

  // In your App.js
  return (
    <div className={` transition-all ease-linear duration-100 ${!(report_category == 'report cards' || report_category == 'general summary') ? 'lg:w-full' : 'lg:w-3/4'} px-2 sm:w-full print:w-full flex flex-col justify-evenly mx-auto`}>
      <div className="print:hidden w-full my-2" >
        <div className="w-full flex flex-1 p-2 bg-white shadow-sm justify-between align-middle print:hidden">
              <div className='flex space-x-2'>
                <Link href={'/A/enroled'} className='p-1 bg-gray-300 cursor-pointer rounded flex gap-2 text-black hover:text-white hover:bg-black'>
                  <TfiArrowLeft  
                  className='text-l font-semibold text-sm' 
                  />
                  <span className='text-xs'>Back</span>
                </Link>                
              </div>
              <div className="flex gap-2 text-xs">
                <ColorThemeSetter/>
                <LogoutButton/>
              </div>
            </div>
        <h2 className='font-semibold tst-sm border-b border-gray-300 mb-2 uppercase' style={{color:theme_bg}}>Select One Report</h2>
        <div className='flex gap-5 flex-wrap '>
            {
                main_category.map((cat, i)=>(
                    <div style={{
                        backgroundColor:report_category===cat.report_type?theme_bg:null,
                        color:report_category===cat.report_type?'white':null,
                    }} 
                    onClick={()=>dispatch({type:'REPORT_CATEGORY', payload:cat.report_type})} key={i} className='w-[100px] h-[100px] rounded shadow-md bg-white pb-1 flex flex-col justify-center items-center cursor-pointer'>
                        <h4 
                        style={{
                            color:report_category===cat.report_type?'white':null,
                            fontWeight:report_category===cat.report_type?'bold':null,
                    }}
                    className='text-sm border-b border-gray-300 text-gray-500 text-center capitalize'>{cat.report_type}</h4>
                        <div className='p-2 rounded-full mt-1' style={{backgroundColor:colors.lighter_90}}>{cat.icon}</div>
                    </div>
                ))
            }
            <div style={{backgroundColor:theme_bg}} 
                    onClick={()=>print()}
                    className='rounded-lg shadow-md bg-white p-3 w-[100px] h-[100px] flex flex-col justify-center items-center cursor-pointer ml-auto'>
                <h4 
                    className='border-b border-gray-300 text-gray-100 text-center uppercase'>
                    PRINT
                </h4>
                <div className='p-2 rounded-full mt-4' style={{backgroundColor:colors.lighter_90}}>
                    <TfiPrinter style={{color:theme_bg}} className="text-3xl mt-1 text-gray-500"/>
                </div>
            </div>
        </div>
      </div>
      {children}
    </div>
  );
}
