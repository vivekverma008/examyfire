
import React, { useEffect, useState }  from 'react';
import Nav from "../components/navbar";
import CodingSection from "../components/editor";
import Footer from "../components/footer";
import { json, useParams } from 'react-router-dom';
// import CodingSection  from '../components/questionPart';

let URL = "http://127.0.0.1:8000/api/v1/user/getproblem/";

export default function CodingPage(){
    
    
    let [id , setid] = useState(useParams().id);
    let [obj , setobj] = useState({prop : "emptu"});
    useEffect(()=>{
        let loadquestion = async function(){
            let resp = await fetch(URL+`${id}`,{
                credentials : "include"
            });
            let jsonResp = await resp.json();
      
            if (jsonResp.data) {
                setobj(jsonResp.data);
            }
            console.log("obj",obj);
        }
            
            loadquestion();
        }, []);
    // obj = {Title : "QuestionTitle - 1" , Statement : "A content question is a question with which the speaker asks the hearer to supply specific information about participants or settings. Content questions contrast primarily with polar questions, which just ask for a 'yes' or 'no' answer."};
   
    return (
        <>
           
            <CodingSection data = {obj}/>
            

        </>
    );    
}