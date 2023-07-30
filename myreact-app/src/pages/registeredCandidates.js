import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../index'
import { useSearchParams } from 'react-router-dom';

const URL = "http://127.0.0.1:8000/api/v1/user/";
export default function RegisteredCandidates() {
    const user = useContext(UserContext);
    const [searchParams, setsearchParams] = useSearchParams();
    const [registeredUsers, setRegisteredUsers] = useState([]);
    useEffect(() => {
        try {
            let id = searchParams.get("contest");
            const loadRegisteredUsers = async function () {
                let resp = await fetch(URL + `showParticipants?contestid=${id}`, {
                    credentials: "include"
                });
                if(!resp.ok){
                    throw  new Error("there is error in loading response");
                }
                let list = await resp.json();
                setRegisteredUsers(list.registeredCandidates);
            }
            loadRegisteredUsers();

        } catch (err) {
            console.log(err.message);
        }

    }, [user]);
    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            username
                        </th>
                        <th>
                            usertype
                        </th>
                    </tr>
                    {registeredUsers.map((candidate , index)=>{
                        return (
                            <tr key = {candidate.id}>
                                <td>
                                    {index+1}
                                </td>
                                <td>
                                    {candidate.useremail}
                                </td>
                                <td>
                                    {candidate.usertype}
                                </td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        </>
    );

}