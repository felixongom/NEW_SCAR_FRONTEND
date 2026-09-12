'use client'

import {createContext, useContext, useReducer,} from 'react'
import {dataReducer, initialState} from "./dataReducer"

let DataContext = createContext()

function DataProvider({children}) { 
  const [state, dispatch] = useReducer(dataReducer, initialState)
  
  return (
    <DataContext.Provider value={{...state, dispatch}}>
      {children}
    </DataContext.Provider>
  )
}
const useDataContext = ()=>useContext(DataContext)
export {DataProvider, useDataContext}