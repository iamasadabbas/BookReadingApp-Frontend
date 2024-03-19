import React, { useEffect, useState } from 'react'
import axiosInstance from "./axiosInstance";

const URL = process.env.BASE_URL || 'http://localhost:5000';


export default function RoleTaskEdit() {
    const [allRole, setAllRole] = useState([]);
    const [allTask, setAllTask] = useState([]);
    const [allTaskStatus, setAllTaskStatus] = useState([]);
    const [taskHeading, setTaskHeading] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const [currentRoleId, setCurrentRoleId] = useState('');
    let config = {
        headers: { 'Content-Type': 'application/json' },
    };

    const handleEditButton = ((roledata) => {
        // console.log(id);
        setCurrentRole(roledata.role)
        setCurrentRoleId(roledata._id)
        axiosInstance.get(`${URL}/managetask/getmanagetaskbyroleId/${roledata._id}`, config)
            .then((response) => {
                // console.log(response);
                if (response.status === 200) {
                    const data = response.data;
                    const tasks = [];
                    const statuses = [];
                    data.forEach((element) => {
                        tasks.push(element.taskId);
                        statuses.push(element.status);
                    });
                    setAllTask(tasks);
                    setAllTaskStatus(statuses);
                    setTaskHeading('Task Status')
                } else {
                    alert('error');
                }
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
                alert('Error fetching roles. Please try again later.');
            });
    })

    const handleChangeCheckbox = (index, e) => {
        const updatedStatuses = [...allTaskStatus];
        updatedStatuses[index] = e.target.checked;
        setAllTaskStatus(updatedStatuses);
        console.log(allTask);
        // console.log(allRole);
        // console.log(index);
        const taskId = allTask[index]._id;
        // const roleId = allRole[index]._id;
        // console.log(taskId);
        const roleId=currentRoleId;
        const newStatus = e.target.checked;

        axiosInstance.put(`${URL}/managetask/getmanagetaskbytaskId/${taskId}/${roleId}`, { status: newStatus }, config)
            .then(response => {
                console.log(response);
                alert('Task status updated successfully');
            })
            .catch(error => {
                console.error('Error updating task status:', error);
                alert('Error updating task status. Please try again later.');
            });

    };


    useEffect(() => {
        axiosInstance.get(`${URL}/role/getallroles`, config)
            .then((response) => {
                // console.log(response);
                if (response.status === 200) {
                    setAllRole(response.data.result);
                    // console.log(response.data.result);
                } else {
                    alert('error');
                }
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
                alert('Error fetching roles. Please try again later.');
            });
    }, [])

    return (
        <div className='body'>
            <div>{!allRole.length == 0 ? (
                <>
                    <h2 className='heading'>Role data</h2>
                    <div className='container'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allRole && allRole?.map((roleData) => (
                                    <tr key={roleData.id}>
                                        <td>{roleData.role}</td>
                                        <td>
                                            <button className='del-button' onClick={() => { handleEditButton(roleData) }}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </>) : (
                <></>
            )}
                <div>
                    <label>
                        <div className='container'>
                            <table className='table'>
                                <h2>{currentRole} {taskHeading}</h2>
                                <tbody>
                                    {allTask.map((task, index) => (
                                        <tr key={index}>
                                            <td>{task.task}</td>
                                            <td>
                                                <input type="checkbox" checked={allTaskStatus[index]} onChange={(e) => handleChangeCheckbox(index, e)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    )
}
