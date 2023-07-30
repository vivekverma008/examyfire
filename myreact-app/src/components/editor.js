import React, { useEffect, useState }  from 'react';
import QuestionPart from "./questionPart";
// statement and title and constaraints 


class Queue {
    constructor() {
        this.items = []
        this.frontIndex = 0
        this.backIndex = 0
    }
    enqueue(item) {
        this.items[this.backIndex] = item
        this.backIndex++
        const newq = new Queue();
        newq.items = this.items.slice();
        newq.frontIndex = this.frontIndex ;
        newq.backIndex = this.backIndex ;
        return newq;
    }   
    dequeue() {
        const item = this.items[this.frontIndex]
        delete this.items[this.frontIndex]
        this.frontIndex++
        const newq = new Queue();
        newq.items = this.items.slice();
        newq.frontIndex = this.frontIndex ;
        newq.backIndex = this.backIndex ;
        return newq;
    }
    peek() {
        return this.items[this.frontIndex]
    }
    empty(){
        
        let result =  (this.frontIndex >= this.backIndex); 
        return result;
    }
}

let URL = "http://127.0.0.1:8000/api/v1/user/";
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDM4M2M4YTUzODRlNmY5NTI1M2RjMGEiLCJ1c2VybmFtZSI6InZpdmVrIiwiZW1haWwiOiJ2aWJodUBnbWFpbC5jb20iLCJ1c2VydHlwZSI6IlN0dWRlbnQiLCJwYXNzd29yZCI6IjEyMzQ1NiIsImJsb2NrU3RhdHVzIjpmYWxzZSwiY3JlYXRlZEF0IjoiMjAyMy0wNC0xM1QxNzozMTo1NC40OTVaIiwidXBkYXRlZEF0IjoiMjAyMy0wNC0xM1QxNzozMTo1NC40OTVaIiwiX192IjowLCJpYXQiOjE2ODQ5MzA4MzMsImV4cCI6MTY4NTAxNzIzM30.PvsQig5wcy6FBCrpW0atMhoQUyiw5Vqto0wRy31Z4Dk"

function EditorPart({data}){

    let [res , setres] = useState("Not Available");
    let [queue , setqueue] = useState(new Queue);
    let jobid = "";

    let formData = new URLSearchParams();

    const [editor, setEditor] = useState(null);

    useEffect(() => {
      const cm = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "text/x-c++src",
        theme: "material-darker"
      });
      setEditor(cm);
    }, []);

    useEffect(()=>{
        let dowork = async function(){
            let  count = 0;
            console.log("queue in effect" , queue);
            console.log("queue items" , queue.items);
            console.log("in queue");
            
            if(!queue.empty()){
                jobid = await queue.peek();
                    console.log("inside");
                    
                let resp = await fetch(URL+`getJobStatus/${jobid}`,{  
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': `Bearer ${token}`
                    }
                            
                });
                let response = await resp.json();
                console.log(response);
                if(response.data == "success"){
                    setres(response.verdict);
                    setqueue(prevQueue => prevQueue.dequeue());
                }
            }
        }
        dowork();
        
       
    },[queue]);

    formData = new URLSearchParams();
    formData.append('contestid', '643ea8a185e2ef275d84ee98');
    formData.append('problemId', `${data.id}`);

    const handleSubmit = async function(event){

        event.preventDefault();
        console.log(editor);
        if(!editor){
            return ;
        }
        let usrCode = await editor.getValue();
        formData.append('code' , usrCode);
        console.log(usrCode);
        let resp = await fetch(URL+"submit", {
            method : "POST",
            credentials: "include",
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        let jsondata = await resp.json();
        console.log( jsondata);        
        setqueue(prevQueue => prevQueue.enqueue(jsondata.data));

        console.log(queue.empty());
        
        console.log("queue : ", queue.items);
        
    }

    return (
        <>
            <div className='flexColoumn scroll-and-width50'>
                
                <textarea id='code' ></textarea>
                <form onSubmit={handleSubmit}>
                    <button type = "submit">
                        Submit
                    </button>

                </form>
              
                <div className='output'>
                    TestResult : {res}
                </div>
            </div>
            

        </>
    );
    
}

export default function CodingSection(props){
    console.log("codingSection : ",props.data);
    return (
        <div className='TwoColoumn-content'>
            <QuestionPart data = {props.data} />
            <EditorPart data = {props.data}/>
        </div>
    );

}







// #include<bits/stdc++.h>
// using namespace std ;

// int main(){
//   string s;
//   getline(cin,s);
//   if(s == "getout now")cout<<"vivek verma";
//   else if(s == "hello")cout<<s;
//   else cout<<"vivek gaur";
  
//   return 0;
// }