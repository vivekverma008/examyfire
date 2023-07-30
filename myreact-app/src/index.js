import { createContext, useState, useEffect } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css"
import Login from './pages/login';
import Home from "./pages/home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CodingPage from './pages/codingPage';
import Layout from './pages/layout';
import TestCaseForm from './pages/addProblem';
import Main from './pages/main';
import ContestInfo from './pages/contest';
import RegisterForContest from './pages/registerContest';
import RegisteredCandidates from './pages/registeredCandidates';

const URL = "http://127.0.0.1:8000/api/v1/user/";
export const UserContext = createContext();




function App() {

    const [user, setuser] = useState({});
    useEffect(() => {
        try {
            
            let loaduser = async function () {
                let resp = await fetch(URL + "getuserinfo", {
                    credentials: "include"
                });

                if (resp.ok) {
                    let jsonResp = await resp.json();

                    console.log(jsonResp);
                    setuser(jsonResp);
                }

                console.log("resp" , resp);
            }

            loaduser();
        } catch (err) {
            console.log(err.message);
        }

    }, []);

    return (

        <UserContext.Provider value={{ user, setuser }}>
            <BrowserRouter>
                <Routes >
                    <Route path="/" element={<Layout user={{ user, setuser }}/>}>
                        <Route index path="/problem/:id" element={<CodingPage user={{ user, setuser }} />} />
                        <Route index path = "/:contest/:id" element={<CodingPage user={{ user, setuser }} />} />
                        <Route path="/problem" element={<Home user={{ user, setuser }} />} />
                        <Route path="/login" element={<Login user={{ user, setuser }} />} />
                        <Route path='/addproblem' element={<TestCaseForm user={{ user, setuser }} />} />
                        <Route path='/home' element={<Main user={{ user, setuser }} />} />
                        <Route path="/contest/:slog" element={<ContestInfo user={{ user, setuser }} />} />
                        <Route path = "/contestregisteration" element={<RegisterForContest user={{user,setuser}}/>} />
                        <Route path='/registeredCandidates' element = {<RegisteredCandidates user={{user,setuser}}/> }/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>

    );
}

export default {
    App,
    UserContext
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

