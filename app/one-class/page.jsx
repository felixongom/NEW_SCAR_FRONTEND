'use client'
import { useDataContext } from '@/context/DataProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import PageSchoolInfo from '@/components/PageSchoolInfo';
import Button from '@/components/Button'
import ResultTable from '@/components/ResultTable'
import { useState } from 'react';
import ReportCardLinks from '@/components/ReportListPopup'
import PreviewStudPics from "@/components/PreviewStudPics"
import { convertSchoolInfoToObject } from '@/utils/reshpe_data';
import { o_level_report_list } from '@/utils/reportList';
import AuthLayout from '@/components/AuthLayout';

export default function OneClass(){
    const _data = useDataContext()
    const searchParams = useSearchParams();
    const active_clas = searchParams.get('clas');
    const [selected, setSelected] = useState('Students')
    const {ranked_data, dispatch, main_school_info} = useDataContext()
    const [showPopUp, setShowPopUp] = useState(false) 
    const data = convertSchoolInfoToObject(_data.school_info)
    const router = useRouter()
    let buttons = ['Students', 'Photos']     

    return(
        <AuthLayout router={router}>
            <div className=' relative'>
                {showPopUp && (
                    <div className='w-full h-full z-10 bg-slate-600 absolute backdrop-filter backdrop-blur-md bg-white/30'>
                        <ReportCardLinks report_list={o_level_report_list} setShowPopUp={setShowPopUp}/>
                    </div>
                )}
                {data===null? (<h1>Loading</h1>):<PageSchoolInfo dispatch={dispatch} main_school_info={main_school_info}/>}
                <div className='mt-3'>
                    <div className='gap-2'>
                        {buttons.map(btn=>(
                            <Button key={btn} text={btn} selected={selected} setSelected={setSelected}/>
                        ))}
                        {selected==='Students'?(<ResultTable setShowPopUp={setShowPopUp}  ranked_data={ranked_data} table_heading = {active_clas}/>):(<PreviewStudPics/>)}
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}