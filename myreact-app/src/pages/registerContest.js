import React,{ useContext, useEffect, useState }  from 'react';
import {UserContext} from '../index'
import { useNavigate, useSearchParams } from 'react-router-dom';

const URL = "http://127.0.0.1:8000/api/v1/user/";
export default function RegisterForContest(){
    
    const user = useContext(UserContext); 
    const navigate = useNavigate();
     const termsofagreemnet = `The registration confirms that you:
     * have read the contest rules
     * will not violate the rules
     * will not communicate with other participants, use another person's code for solutions/generators, share ideas of solutions and hacks
     * will not attempt to deliberately destabilize the testing process and try to hack the contest system in any form
     * will not use multiple accounts and will take part in the contest using your personal and the single account.
    `
    const [searchParams , setsearchParams] = useSearchParams();
    const [radioval , setradioval] = useState(false);
    const handlechange = function(e){
        console.log(!radioval);
        e.target.checked = !radioval ;
        setradioval(e.target.checked);
    }

    const handleSubmit = async function(e){
       
        try{
            
            e.preventDefault();
            if(!radioval){
                throw (new Error("You have to Agree"));
            }
            let id =  searchParams.get("contest");
            const resp = await fetch(URL + "Register",{
                method : "post",
                credentials  : "include",
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify({contestid : id})
            })
            if(resp.ok){
                let data = await resp.json();
                console.log(data);
                navigate('/home');
                
            }
    
        }catch(err){
            console.log("error : ")
            console.log(err.message);
        }
        
        
        
        console.log("user wants to register");
        
    }
    return (
        <>
            Terms of agreement : 
            <textarea readOnly= {true} value={termsofagreemnet}></textarea>
            <label>
                <input type='radio' onClick={handlechange} ></input>Agree
            </label>
            <button  onClick={handleSubmit}>
                Register
            </button>
        </>
    );    
}