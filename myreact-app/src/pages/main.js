import { useContext, useEffect, useState } from "react";
import Table from "../components/problemTable";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../index'
import { DateTime } from 'luxon';



const ContestList = ({ contests, user }) => {
    const navigate = useNavigate();
    
   
    const handleRegister = function(e,contest){
        e.preventDefault();
        console.log(contest);
        if(contest.status == "REGISTRATION_STARTED"){
            
            navigate(`/contestregisteration?contest=${contest.id}`);
        }
    }


    return (
        <>
            {(user.user.username == null || user.user.username == undefined) && <div>You Need To Login</div>}

            {(user.user.username) && <div >
            <div className="datatable">
                <div className="tabletitle">Upcoming Contents/Ongoing Contests</div>
                <table className="contest-info">
                    <tbody>
                        <tr>
                            <th className="tablehead" >Name</th>
                            <th className="tablehead">Start</th>
                            <th className="tablehead">Duration</th>
                            <th>&nbsp;</th>
                            <th>&nbsp;</th>
                        </tr>
                        {
                            contests.filter((contest) => {
                                return (contest.status !== "TEST_COMPLETE");
                            }).map((contest, index) => {
                                const StartTime = (DateTime.fromISO(contest.startTime, { zone: 'utc' })).setZone(DateTime.local().zoneName).toLocal();
                                const EndTime = (DateTime.fromISO(contest.startTime, { zone: 'utc' })).setZone(DateTime.local().zoneName).toLocal();
                                const regStartTime = (DateTime.fromISO(contest.regStartTime, { zone: 'utc' })).setZone(DateTime.local().zoneName).toLocal();
                                const regEndTime = (DateTime.fromISO(contest.regEndTime, { zone: 'utc' })).setZone(DateTime.local().zoneName).toLocal();
                                const diff = StartTime.diff(DateTime.now());
                                const diffreg = regStartTime.diff(DateTime.now());
                                return (

                                    <tr key={(contest.id)}>
                                        <td>
                                            {contest.title}
                                            <br />
                                            {contest.status == "TEST_STARTED" && <Link to={`/contest/${contest.title}`}> Enter Contest</Link>}
                                        </td>
                                        <td>
                                            {StartTime.toFormat('MMMM/dd/yyyy')}
                                            <br />
                                            {StartTime.toFormat('HH:mm')}
                                        </td>
                                        <td>
                                            {contest.duration}
                                        </td>
                                        <td>
                                            {contest.status == "TEST_STARTED" && <>Ongoing <br /> <Link to={`/contest/${contest.title}`}>Enter Contest</Link></>}
                                            {contest.status != "TEST_STARTED" &&
                                                <>
                                                    {

                                                        ((diff.as('days') >= 1) ? <>Before Start{Math.floor(diff.as('days'))} days</> : <>Before Start{Math.floor(diff.as('hours'))}hours</>)

                                                    }
                                                </>

                                            }
                                        </td>
                                        <td>
                                            {contest.status == "REGISTRATION_COMPLETE" && <>Registrations Closed</>}
                                            {contest.status == "CREATED" &&
                                                <>
                                                    {

                                                        ((diffreg.as('days') >= 1) ? <>Before Start{Math.floor(diffreg.as('days'))} days</> : <>Before Start{Math.floor(diffreg.as('hours'))}hours</>)

                                                    }
                                                </>

                                            }
                                            {(contest.status == "REGISTRATION_STARTED" && contest.user_registered === false) && <>Registrations Started<br /> <button onClick={(e)=>{handleRegister(e,contest)}}>Register</button></>}
                                            {(contest.status == "REGISTRATION_STARTED" && contest.user_registered === true) && <>Registered <br/><Link to = {`/registeredCandidates?contest=${contest.id}`}>Registered Candidates</Link></>}

                                        </td>

                                    </tr>



                                );
                            })

                        }
                    </tbody>


                </table>
                

                </div>

                <div className="tabletitle">
                    Past Contests
                </div>
                {
                    contests.filter((contest) => {
                        return (contest.status === "TEST_COMPLETE");
                    }).map((contest) => {
                        if (contest.status == "TEST_COMPLETE")
                            return <div key={contest.id}> <Link to={`/contest/${contest.title}`} >{contest.title}</Link></div>

                    })}


            </div>}

        </>
    )
}

const CreateContest = ({ user }) => {


    const [formData, setFormData] = useState({
        startTime: '',
        endTime: '',
        duration: '',
        slug: '',
        regStartTime: '',
        regEndTime: '',
    });
    const [problems, setProblems] = useState([]);
    const [suggestions, setsuggestions] = useState([]);
    const [inputvalue, setinputvalue] = useState('');
    const [flag, setflag] = useState(false);
    useEffect(() => {
        // Calculate the duration based on startTime and endTime
        if (formData.startTime && formData.endTime) {
            const start = new Date(formData.startTime);
            const end = new Date(formData.endTime);
            const diffInMinutes = Math.abs(end - start) / 60000; // Convert milliseconds to minutes
            setFormData((prevFormData) => ({
                ...prevFormData,
                duration: diffInMinutes.toString(),
            }));
        }
    }, [formData.startTime, formData.endTime]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                if (!flag) {
                    const response = await fetch(`http://127.0.0.1:8000/api/v1/user/getsuggestion?query=${inputvalue}`, {
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        console.log("unauthorised");
                    }
                    const data = await response.json();
                    if (inputvalue.length > 0)
                        setsuggestions(data.suggestions);
                    else {
                        setsuggestions([]);
                    }
                    console.log("suggestions", suggestions);
                }
                else {
                    setflag(false);
                    setsuggestions([]);
                    setinputvalue('');
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchSuggestions();
    }, [inputvalue]);
    const resetallstates = () => {
        setFormData({
            startTime: '',
            endTime: '',
            duration: '',
            slug: '',
            regStartTime: '',
            regEndTime: '',
        });
        setProblems([]);
        setsuggestions([]);
        setinputvalue('');
        setflag(false);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    let handlesuggestionchange = async (e) => {
        const { value } = e.target;
        setinputvalue(value);
    }
    const handlevalchange = async (e, obj) => {
        setflag(true);
        setinputvalue(e.target.textContent);
        const isDuplicate = problems.some((problem) => problem.id === obj.id);
        if (!isDuplicate) {
            setProblems([...problems, obj]);
        }
        console.log(problems);
    }
    const handleSubmit = async function (e) {
        try {
            e.preventDefault()
            let resp = await fetch(`http://127.0.0.1:8000/api/v1/user/createcontest`, {
                method: 'post',
                credentials: 'include',
                headers: {
                    "content-type": "application/json",
                },

                body: JSON.stringify({ ...formData, list: problems })
            });
            if (!resp.ok) {
                throw new Error("error");
            }
            let data = await resp.json();

            console.log(data);
            resetallstates();


        } catch (err) {
            console.log(err);
        }

    }

    const handleDelete = function (e, id) {
        setProblems(problems.filter((p) => {
            return (p.id != id);
        }))
    }
    console.log("in create contest ", user)
    return (
        <>

            {user.user.usertype == "Teacher" && <div>
                <label>
                    Slug:
                    <input type="text" name="slug" value={formData.slug} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Start Time:
                    <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    End Time:
                    <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Duration (in minutes):
                    <input type="number" name="duration" value={formData.duration} readOnly />
                </label>
                <br />
                <label>
                    Registration Start Time:
                    <input
                        type="datetime-local"
                        name="regStartTime"
                        value={formData.regStartTime}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Registration End Time:
                    <input type="datetime-local" name="regEndTime" value={formData.regEndTime} onChange={handleInputChange} />
                </label>
                <div>
                    Problems :
                    {problems.map((problem) => {
                        return (
                            <div key={problem.id}>Problem name : {problem.title} <Link onClick={(event) => { handleDelete(event, problem.id) }}>X</Link></div>
                        )
                    })}

                </div>
                <button >+</button>
                <input type="text" value={inputvalue} onChange={handlesuggestionchange} name="problem"></input>
                {suggestions.map((suggestion) => {
                    return <div key={suggestion.id} onClick={(event) => { handlevalchange(event, { id: suggestion.id, title: suggestion.title }) }} >{suggestion.title}</div>
                })}
                <div>
                    <button type="submit" onClick={handleSubmit}>Add Contest</button>
                </div>

            </div>}
            {(user.user.username == null || user.user.username == undefined) && <div>
                You need to signIn
            </div>}

        </>


    );
}

const URL = "http://127.0.0.1:8000/api/v1/user/"
export default function Main() {
    let [contests, setcontests] = useState([]);
    let [userinfo, setuserinfo] = useState({});
    let [obj, setobj] = useState({ viewContestList: true, viewCreateContest: false });


    const user = useContext(UserContext);
    useEffect(() => {
        try {
            let getcontests = async function () {
                let resp = await fetch(URL + "getallcontests", {
                    credentials: "include",
                })
                if (!resp.ok) {

                } else {
                    let jsondata = await resp.json();
                    setcontests(jsondata.testlist);
                }


            };

            getcontests();
        } catch (err) {
            console.log(err.message);
        }


    }, [user]);
    let handleRenderContestList = function () {
        setobj({ viewContestList: true, viewCreateContest: false });
    }
    let handleRenderCreateContest = function () {
        setobj({ viewContestList: false, viewCreateContest: true });
    }
    let handlehovered = function(e){
        e.target.offsetLeft
    }
    let handle2_levelSelected = function(e){

    }



    return (

        <>
            
            <div className="second-level-menu" >
                <ul className="second-level-menu-list">
                    
                    <li className="currentSelected" onClick={handleRenderContestList}>Contest Lists</li>
                    <li className="" onClick={handleRenderCreateContest}>Create Contest</li>
                </ul>
                
                {/* <div className="sidePart">
                    <button onClick={handleRenderContestList}>Contests List</button>
                    <button onClick={handleRenderCreateContest}>Create Contest</button>
                </div> */}
                <div className="">
                    {(obj.viewContestList === true) ? <ContestList contests={contests} user={user} /> : <CreateContest user={user} />}
                </div>
            </div>

        </>
    );
}