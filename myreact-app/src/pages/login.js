import React,{ useContext, useEffect, useState }  from 'react';
import {UserContext} from '../index'

import '../css files/login.css';
import { useNavigate } from "react-router-dom";

export default function Login (){
    
    const user = useContext(UserContext);
    const [userinfo , updateinfo] = useState({username : "vivek" , });
    const navigate = useNavigate();
    function handleupdate(e){
        updateinfo(previousState => { 
            return {...previousState , [e.target.name] : e.target.value }
        });
    }
    let URL = "http://127.0.0.1:8000/api/v1/usersignin";
    async function handleSubmit(e){
        e.preventDefault();
        const resp  = await fetch(URL , {
            method : "POST" , 
            credentials : "include" ,
            headers : {
                "Content-Type" : "application/json"
            } ,
            body : JSON.stringify(userinfo)
            
        });
        if(resp.ok){
            
            let data = await resp.json();
            console.log(data);
            console.log("logged in ");
            user.setuser(data.data.user);
            console.log("hehe",data.data.user);
            localStorage.clear();
            navigate('/home');

        }
        
        
        
    }
    
    
    return (
        <>
        
        
        <div className="boundary-content">
                <h2>Login</h2>
                <form className="centercontent" onSubmit={handleSubmit}>
                    <div className="formgroup">
                        <label htmlFor ="username" ><b>Username:</b></label>
                        <input type = "text" placeholder = "Enter Username " name = "username" required onChange={handleupdate}></input>
                    </div>
                    <div className="formgroup">
                        <label htmlFor ="email"><b>UserEmail:</b></label>
                        <input type = "email" placeholder = "Enter Email " name = "email" required onChange={handleupdate}></input>
                    </div>
                    <div className="formgroup">
                        <label htmlFor ="password"><b>Password:</b></label>
                        <input type = "password" placeholder = "Enter Password " name = "password" required onChange={handleupdate}></input>
                    </div>
                    
                    <button type="submit">Login</button>
               
                </form>
            
        </div>
            
        </>
    );
}