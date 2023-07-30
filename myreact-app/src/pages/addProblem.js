import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';


const TestCases =  function({childstate}){
    let [testcases , settestcases] = useState([{input : "" , output : "" , sample : false , explanation : "" ,id : Date.now() }]);
    let addtestcase = function(e){
        e.preventDefault();
        settestcases(tcs => {return [...tcs ,{input : "" , output : "" , sample : false , explanation : "" , id : Date.now() } ]});
    };
    let deltestcase = function(event , id){
        let updated_testcases = testcases.filter((testcase)=>{return (testcase.id !== id)}) 
        settestcases(updated_testcases);
    }

    const handleUpdate = function(e, id) {
        console.log(testcases)
        settestcases((prevTestCases) => {
          return prevTestCases.map((tc) => {
            if (tc.id === id) {
              return { ...tc, [e.target.name]: e.target.value };
            }
            return tc;
          });
        });
      };
      useEffect(()=>{
        childstate(testcases);
      },[testcases]);
    return (
        <>
            <div className='title'>Test Cases</div>
            {testcases.map((tc , index)=>{
                return (
                <div key = {tc.id} className='test-cases'>
                    <div onClick={(event)=>{deltestcase(event , tc.id)} } className='delete-button'> X  {index}</div>
                    <div>
                        <label htmlFor='input' className='input-label'>input : </label>
                        <textarea name = "input" value = {tc.input} onChange={(e)=>{handleUpdate(e,tc.id)}} />
                    </div>
                    <div>
                        <label htmlFor='output' className='output-label'>Output : </label>
                        <textarea name = "output" value = {tc.output} onChange={(e)=>{handleUpdate(e,tc.id)}} />
                    </div>
                    <div>
                        <label htmlFor='explanation' className='explanation-label'>Explanation : </label>
                        <textarea name = "explanation" value = {tc.explanation} onChange={(e)=>{handleUpdate(e,tc.id)}}  />
                    </div>
                </div>);
            })} 
            <button onClick = {addtestcase} className='add-button'>AddTest Case</button>       
        </>
    );
}








const TestCaseForm = () =>{
    const [probleminfo , updateinfo] = useState({});
    const [testcase_data , settestcase_data] = useState([]);
    const handleUpdate = function(e){
        updateinfo(previous => {return {...previous , [e.target.name] : e.target.value}});
        console.log(probleminfo);
    }
    const URL = "http://127.0.0.1:8000/api/v1/user/"
    const handleSubmit = async function(e){
        e.preventDefault();
        
        let resp = await fetch(URL+"createproblem" , {
            method : "post" , 
            credentials : "include",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({...probleminfo , testcases : testcase_data})
        })
        let dta = await resp.json();
        console.log(dta);
    }
    const getchildState = function(childstate){
        console.log("in parent " , childstate);
        settestcase_data(childstate)
    }
    const handleupdateCheck = function(e){
        
        updateinfo(previous => {return {...previous , [e.target.name] : e.target.checked}});
        console.log(probleminfo);
    }

    return(
        <>
            <b className='title'> Add Problem </b>
           <form className='test-case-form'>

                <div>
                    <label htmlFor='title' >Title : </label>
                    <textarea name = "title" value = {probleminfo.title} onChange={handleUpdate} />
                </div>
                
                <div>
                    <label htmlFor='statement' >Statement : </label>
                    <textarea name = "statement" value = {probleminfo.statement} onChange={handleUpdate} />
                </div>
                <div>
                    <label htmlFor='status'>Status</label>
                    <input type='checkbox'  name = "status" onChange={handleupdateCheck}></input>
                </div>
                <div>
                    <label htmlFor = "constraint">Constraint</label>
                    <input type='text' name = "constraint" onChange={handleUpdate}></input>
                </div>
                <div>
                    <label htmlFor='timelimit' >Time Limit </label>
                    <input type='number' name='timelimit' onChange={handleUpdate}></input>
                </div>
                <div>
                    <label htmlFor='memorylimit' >Memory Limit </label>
                    <input type='number' name='memorylimit' onChange={handleUpdate}></input>
                </div>
                <div>
                    <TestCases childstate = {getchildState}/>
                    
                </div>
                <div>
                    <button onClick={handleSubmit} >Create Problem</button>
                </div>
               
            </form>
        </>
    );
};


export default TestCaseForm;