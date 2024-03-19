import React, { useState, useEffect } from 'react';
import axiosInstance from "./axiosInstance";

const URL = process.env.BASE_URL || 'http://localhost:5000';

export default function ManageTask() {
    let config = {
        headers: { 'Content-Type': 'application/json' },
    };
    const [allRole, setAllRole] = useState([]);
    const [allTask, setAllTask] = useState([]);
    const [roleInput, setRoleInput] = useState('');
    const [selectedRoleValue, setSelectedRoleValue] = useState('');
    const [selectedTaskValue, setSelectedTaskValue] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const getTaskId = async () => {
        allTask.forEach(element => {
            //    console.log(element._id); 
            if (element.task == selectedTaskValue) {
                // console.log(element._id);
                setSelectedTaskId(element._id);
            }
        });
        allRole.forEach(element => {
            //    console.log(element._id); 
            if (element.role == selectedRoleValue) {
                // console.log(element._id);
                setSelectedRoleId(element._id)
            }
        });

    }

    const handleRoleDropdownChange = (event) => {
        setSelectedRoleValue(event.target.value);
    };
    const handleTaskDropdownChange = (event) => {
        setSelectedTaskValue(event.target.value);
    };

    const handleRoleChange = (e) => {
        setRoleInput(e.target.value);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    await getTaskId();

    if (!selectedRoleId || !selectedTaskId) {
        alert('Please select a role and a task.');
        return;
    }
    const formData = new FormData();
    formData.append('roleId', selectedRoleId)
    formData.append('taskId', selectedTaskId)
    formData.append('status', "false")

    // try {
        const response = await axiosInstance.post(`${URL}/managetask/addmanagetasks`, formData, config);
        console.log(response);
        if (response.data.status === 200) {
            alert('Task added successfully');
        } else if(response.data.status === 400) {
            alert('Already exists');
        } else {
            // Handle other status codes
            alert('An error occurred');
        }
        
    // } catch (error) {
    //     if (error.response && (error.response.status === 400 || error.response.status === 409)) {
    //         alert('Task already exists');
    //     } else {
    //         console.error('Error:', error);
    //     }
    // }

    }
        const handleTaskManageSubmit = ((e) => {

        })

        useEffect(() => {
            axiosInstance.get(`${URL}/role/getallroles`, config)
                .then((response) => {
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
            axiosInstance.get(`${URL}/task/getalltasks`, config)
                .then((response) => {
                    if (response.status === 200) {
                        setAllTask(response.data.result);
                        // console.log(response.data.result);
                    } else {
                        alert('error');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching roles:', error);
                    alert('Error fetching roles. Please try again later.');
                });
        }, []);

        useEffect(() => {
            getTaskId()
        }, [selectedTaskValue])

        return (
            <div>
                <h1 className='heading'>Manage Role Here</h1>
                <div className="login-container">
                    <form onSubmit={handleSubmit}>
                        <select value={selectedRoleValue} onChange={handleRoleDropdownChange}>
                            <option value="">Select an option</option>
                            {allRole.map((roledata, index) => (
                                <option key={index} value={roledata.role}>
                                    {roledata.role}
                                </option>
                            ))}
                        </select>
                        <br />
                        <select value={selectedTaskValue} onChange={handleTaskDropdownChange}>
                            <option value="">Select an option</option>
                            {allTask.map((taskData, index) => (
                                <option key={index} value={taskData.task}>
                                    {taskData.task}
                                </option>
                            ))}
                        </select>
                        <br />
                        <button type="submit" className='button' onClick={handleSubmit}>submit</button>
                    </form>
                </div>
            </div>
        );
    }

