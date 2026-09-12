'use client'
import { useDataContext } from '@/context/DataProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import PageSchoolInfo from '@/components/PageSchoolInfo';
import Button from '@/components/Button'
import UnebUceResultTable from '@/components/UnebUceResultTable'
import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';

export default function OneClass(){
    const searchParams = useSearchParams();
    const active_clas = searchParams.get('clas');
    const [selected, setSelected] = useState('Students')
    const {dispatch, main_school_info} = useDataContext()
    const router = useRouter()

    return(
        <AuthLayout router={router}>
            <div className=' relative'>
                <PageSchoolInfo dispatch={dispatch} main_school_info={main_school_info}/>
                <div className='mt-3'>
                    <div className='gap-2'>
                        <UnebUceResultTable table_heading = {active_clas}/>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}