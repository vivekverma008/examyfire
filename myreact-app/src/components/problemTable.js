import React from "react";
import { Link } from "react-router-dom";



function TableRow({rowData }){
    const {title , statement , solvedby , timelimit , memorylimit , sampletestcases , solvedbyUser,id} = rowData;
    console.log("row data " , rowData);


    return (
        
            <tr>
            <td>{rowData.key}</td>
            <td><Link to = {`/problem/${id}`}>{title}</Link></td>
            <td>{solvedbyUser}</td>
            </tr>
        
        
    );
}

export default function Table({data}){
    console.log("data"  , data);
    return(
        <table className="table">
            <thead className="tablehead">
                <tr>
                    <th>pid</th>
                    <th>Problem Slug</th>
                    <th>Done</th>
                </tr>
            </thead>
            <tbody>
                
            {data.map((row , index) => (
                <TableRow key={index} rowData={{ ...row, key: index+1 }} />
            ))}

            </tbody>
        </table>
    );
};