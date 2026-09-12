import {generateNumbersFrom} from '@/utils/index'
import {brightness} from "color-tin"

export default function Pages({handleParamChange,d, page ,theme_bg}) {
    return (
        <div className='relative my-1 border-gray-400 justify-end' style={{with:'100%'}}>
        <div className=' absolute right-0 flex gap-1'>
            {generateNumbersFrom(d?.num_pages, 1).map(_page=>(
                <span 
                style={{background:_page==page?theme_bg:'', color:brightness(theme_bg)<65?'white':'black'}}
                key={_page} 
                onClick={()=>handleParamChange(_page)} 
                className={`px-2 text-xs ${_page==page?' text-gray text-white font-bold':'text-gray-800 bg-slate-300'} text-xs cursor-pointer`}>{_page}</span>
            ))}
        </div>
    </div>
    )
}