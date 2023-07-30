import { useEffect, useState } from "react";
import { Link, json, useNavigate, useParams } from "react-router-dom";




const URL = "http://127.0.0.1:8000/api/v1/user/getcontest/"




export default function ContestInfo (){
    let [slog , setslog] = useState(useParams().slog);
    let [obj , setobj] = useState({questions : []});
    const navigate = useNavigate();
    useEffect(()=>{
        
        let loadcontest = async function(){
            let resp = await fetch(URL+`${slog}`,{
                credentials : "include"
            });
            if(resp.ok){
                let jsonResp = await resp.json();
                
                console.log(jsonResp);
                setobj(jsonResp);
            }else{
               
                navigate('/home');
            }

            
            // console.log("obj",obj);
        }
                
            loadcontest();
        }, [slog]);


    return (
        <>
            <p>In Contest</p>
            <div>
                {obj.questions && obj.questions.map((que)=>{
                    return (<div key={que.id}> 
                        title : <Link  to = {`/problem/${que.id}`} >{que.title}</Link> , solvedby : {que.solvedby.length}
                    </div>);
                })}
            </div>
        </>
    );
}