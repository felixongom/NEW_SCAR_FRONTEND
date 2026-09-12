import { useDataContext } from "@/context/DataProvider"
import Link from "next/link"
import {brightness} from 'color-tin'

function PdfBackButton({selected_clas}) {
    const clss = parseInt(selected_clas.split(' ')[1])
    const {theme_bg} = useDataContext()

    let redirect_link = null
    if(selected_clas.includes("UNEB UCE")){
        redirect_link = `/uneb-uce?clas=UNEB UCE`
    }else if(clss<5){
        redirect_link = `/one-class?clas=${selected_clas}`
    }else{
        redirect_link = `/A/enroled?clas=${selected_clas}`
    }
    // 
    return (
        <Link 
            className="text-sm px-2 py-0 rounded-md" 
            style={{background:theme_bg, color:brightness(theme_bg)<70?"white":'black'}} 
            href={redirect_link}
            >Back</Link>
    )
}

export default PdfBackButton