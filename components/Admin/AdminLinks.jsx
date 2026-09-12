import Link from "next/link"
import { useDataContext } from "@/context/DataProvider"

export default function AdminLinks(){
    const {theme_bg}=useDataContext()
    return(
        <div>
            <button className="px-1 rounded-full py-1">
                <Link className="rounded-md w-full text-xs px-1" style={{ background:theme_bg, color:'#fff'}} href={'/admin/add-schools'}>+ Add School</Link>
            </button>
            <button className="px-1 rounded-full mb-3 py-1">
                <Link className="rounded-md w-full text-xs px-1" style={{ background:theme_bg, color:'#fff'}} href={'/admin/add-admins'}>+ Add Amins</Link>
            </button>
            <button className="px-1 rounded-full mb-3 py-1">
                <Link className="rounded-md w-full text-xs px-1" style={{ background:theme_bg, color:'#fff'}} href={'/admin/schools'}>School</Link>
            </button>
            <button className="px-1 rounded-full mb-3 py-1">
                <Link className="rounded-md w-full text-xs px-1" style={{ background:theme_bg, color:'#fff'}} href={'/admin/admins'}>Admins</Link>
            </button>
        </div>
    )
}