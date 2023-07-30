
import React,{ useContext, useEffect, useState }  from 'react';
import {UserContext} from '../index'
import Nav from "../components/navbar";
import Footer from "../components/footer";

export default function Layout(){
    
    const user = useContext(UserContext); 
    console.log(user);   
    return (
        <>
            <div id='body'>
            <Nav  user = {user}/>
            
            <Footer/>
            </div>
            

        </>
    );    
}