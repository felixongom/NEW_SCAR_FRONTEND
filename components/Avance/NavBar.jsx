import { useDataContext } from '@/context/DataProvider';
import {brightness} from 'color-tin'
import ColorThemeSetter from "@/components/ColorThemeSetter" 
import LogoutButton from '../LogoutButton';
import { IoMenuOutline } from "react-icons/io5";

function NavBar({heading}) {
  const {dispatch,toggle_manu,main_school_info, selected_clas, theme_bg} = useDataContext()
  const handleClick = (c)=>{
    dispatch({type:'SELECTED_CLAS', payload:c})  
  }
  
  // 
  let classes = ['SENIOR 1', 'SENIOR 2', 'SENIOR 3', 'SENIOR 4','SENIOR 5', 'SENIOR 6']
  return (
    <div className="w-full flex flex-1 p-2 bg-white shadow-sm justify-between align-middle print:hidden">
      <div className='flex space-x-2'>
        {
          toggle_manu &&
          <span className='p-1 bg-gray-300 cursor-pointer rounded' onClick={()=>dispatch({type:'TOGGLE_MENU', payload:!toggle_manu})}>
            <IoMenuOutline  
            className='text-l font-semibold' 
            />
          </span>
        }
        <h1 className="font-bold capitalize text-gray-600 text-sm">{heading}</h1>
         
      </div>
      <div className="flex gap-2 text-xs">
        {
          classes.map(c=>(
            <span
              style={{
                borderRadius:`10px`,
                background:`${selected_clas  === c? theme_bg: "#e6e6e6"}`,
                color:`${selected_clas  === c?(brightness(theme_bg)<60?"white":'#1a1a1a'):'#1a1a1a'}`,
                fontWeight:`${selected_clas  === c? "bold":'normal'}`,
              }} 
              className="cursor-pointer py-1 px-3 gap-1" onClick={()=>handleClick(c)} 
              key={c}
              
              >{'S'+c.split(' ')[1]}</span>
          ))
        }
        <ColorThemeSetter/>
        <button class="text-gray-800 px-2 py-0.1 rounded-2xl font-medium backdrop-blur-md bg-white/10 border border-gray-300 transition-all duration-300 active:scale-95">
          {main_school_info?.time_left}
        </button>
        <LogoutButton/>
      </div>
    </div>
  );
}

export default NavBar;
