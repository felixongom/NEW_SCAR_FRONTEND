'use client'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
// import 'ag-grid-community/styles/ag-grid.css'
// import 'ag-grid-community/styles/ag-theme-alpine.css'
import { useState } from 'react';
// import { useContext } from 'react';
// import { DataContext } from '@/context/DataProvider';

ModuleRegistry.registerModules([AllCommunityModule]);
// 
const GridExample = (jsonData) => {
    

    let data = jsonData?.jsonData?.map(d=>  ({["LEARNER'S NAME"]:d["STUDENT NAME"],["MATH AOI"]:parseFloat(d["MATH AOI"]).toFixed(1), ["ENG AOI"]:d["ENG AOI"], ["PHY AOI"]:d["PHY AOI"], ["AVG"]:parseFloat(d["AVG"]).toFixed(1)}));
    data = data?.filter(d=>d["LEARNER'S NAME"]!==undefined)
    // console.log(data);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState([
        { field: "LEARNER'S NAME" },
        { field: "MATH AOI" },
        { field: "ENG AOI" },
        { field: "PHY AOI" },
        { field: "AVG" }
    ]);
    return (
    // Data Grid will fill the size of the parent container
    <div style={{ height: 500 }} className='ag-theme-alpine'>
        <AgGridReact
            rowData={data}
            columnDefs={colDefs}
        />
    </div>
    )
}
export default GridExample
