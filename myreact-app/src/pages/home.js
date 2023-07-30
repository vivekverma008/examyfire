import { useEffect, useState } from "react";
import Table from "../components/problemTable";



const URL = "http://127.0.0.1:8000/api/v1/user/"
export default function Home(){
    let [problems , setproblems] = useState([]);
    useEffect(()=>{
        let getproblems = async function() {
            let resp = await fetch(URL+"getallproblems",{
                credentials : "include",
            })
            let jsondata = await resp.json();
            setproblems(jsondata.data);
        };

         getproblems();
          
    },[]);

    return (
        
        <>
            <div className="boundarytable " >
                <h2>Problem Set</h2>
                <Table data = {problems} />
            </div>
            
        </>
    );
}