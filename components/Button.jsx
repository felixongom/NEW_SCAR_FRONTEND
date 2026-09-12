// components/Button.jsx
import React from 'react';

const Button = ({text, selected, setSelected }) => {
  
  return (
     <button
          onClick={()=>setSelected(text)}
          className={`${text===selected?'bg-gray-800 text-white':'bg-gray-300 text-gray-800'} ml-2  px-1 rounded-md transition text-sm cursor-pointer`}
        >{text}</button>
  );
};

export default Button;
