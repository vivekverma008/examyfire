import React, { useEffect, useState }  from 'react';

// statement and title and constaraints 


      
 

export default function QuestionPart(props){
    
   

    return (
        <>
            <div className='flexColoumn scroll-and-width50'>
                <h2 className='quesTitle'>Question: {props.data.title}</h2>
                <p>TimeLimit : {props.data.timelimit}</p>
                <p>MemoryLimit : {props.data.memorylimit}</p>
                <h4 className='quesStatement'>{props.data.statement}</h4>
                
                <h5>{props.data.constraint}</h5>
            </div>
            

        </>
    );
}