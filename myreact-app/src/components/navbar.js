import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";
import '../css files/navbar.css';


function Navele(props) {

    return (

        <div className="navele">
            <p className="navElementContent">{props.content}</p>
        </div>

    );
};
let URL = "http://127.0.0.1:8000/api/v1/user/"
export default function Navbar({user}) {
    
    let [show , setshow] = useState(false);
    
    useEffect(()=>{
        console.log("In navbar" ,user );
    },[user])
    
    const navigate = useNavigate();
    const handleLogout = async () => {
        console.log("in logout");
        try{
            await fetch(URL+"logout", {
                credentials: "include",
    
            });
            user.setuser({});
            localStorage.clear();
            
            setTimeout(() => {
                navigate('/home');
            }, 500);

        }catch(err){
            console.log(err.message);
        }

       
    };
    const handletoggle = function(e){
        console.log(e.target);
       setshow(!show);
    }

    return (
        <>
            <div id='header'>
                <img src='images/Code.png'/>
                <div className='loguser'>
                    {(user.user.username == null || user.user.username == undefined) && <div><Link to = "/Login">Enter</Link>|<Link>Register</Link></div>}
                    {(user.user.username) && (<div><Link to = "/home">{user.user.username}</Link>|<Link onClick={handleLogout}>Logout</Link></div> )}
                </div>
            </div>
            
            <nav id="navbar">
                <button className={`navmenu ` } onClick= {handletoggle}><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
                    <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
                </svg></button>
                <div className={` ${show ? 'show' : 'navlinks'} `}>
                    <Link to = "/home"><Navele content="Home" /></Link>
                    <Link to="/Problem"><Navele content="Problem" /></Link>
                    {(user.user.username == null || user.user.username == undefined) && <Link to="/Login"><Navele content="Login" /></Link>}
                    {(user.user.username) && <Link to="/Home"><Navele content = {user.user.username} /></Link>}
                    {(user.user.username) && <Link onClick={handleLogout} ><Navele content="Logout" /></Link>}
                    <Link to="/Addproblem" ><Navele content="Add problem" /></Link>
                </div>
                

            </nav>
            <Outlet />
        </>
    );
};


