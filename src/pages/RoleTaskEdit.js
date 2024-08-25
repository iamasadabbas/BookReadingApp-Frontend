import React, { useEffect, useState } from 'react'
import axiosInstance from "./axiosInstance";

const URL = process.env.BASE_URL || 'http://localhost:3000';

export default function RoleTaskEdit() {
    
    const [allTaskId, setAllTaskId] = useState([]);
    const [allRoleId, setAllRoleId] = useState([]);
    const [allRole, setAllRole] = useState([]);
    const [allTask, setAllTask] = useState([]);
    const [allTaskStatus, setAllTaskStatus] = useState([]);
    const [taskHeading, setTaskHeading] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const [currentRoleId, setCurrentRoleId] = useState('');
    let config = {
        headers: { 'Content-Type': 'application/json' },
    };

    useEffect(() => {
        addAllTask();
    },[allRoleId,allTaskId])

    const addAllTask = async () => {
        const promises = [];
        for (let i = 0; i < allRoleId.length; i++) {
            const roleId = allRoleId[i];
            for (let j = 0; j < allTaskId.length; j++) {
                const taskId = allTaskId[j];
                const formData = new FormData();
                formData.append('roleId', roleId)
                formData.append('taskId', taskId)
                formData.append('status', "false")
    
                promises.push(axiosInstance.post(`${URL}/managetask/addmanagetasks`, formData, config));
            }
        }
        try {
            await Promise.all(promises);
            console.log('All tasks added successfully.');
        } catch (error) {
            console.error('Error adding tasks:', error);
        }
    }
    

    const handleEditButton = ((roledata) => {
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
        // console.log(allTask);
        const taskId = allTask[index]._id;
        const roleId=currentRoleId;
        const newStatus = e.target.checked;

        axiosInstance.put(`${URL}/managetask/getmanagetaskbytaskId/${taskId}/${roleId}`, { status: newStatus }, config)
            .then(response => {
                // console.log(response);
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
                if (response.status === 200) {
                    const roles=response.data.result;
                    setAllRole(roles);
                    const allRoleIds=[]
                    roles.forEach(element => {
                    allRoleIds.push(element._id);
                    });
                    setAllRoleId(allRoleIds)
                } else {
                    alert('error');
                }
            })
            .catch((error) => {
                console.error('Error fetching roles:', error);
                alert('Error fetching roles. Please try again later.');
            });
            axiosInstance.get(`${URL}/task/getalltasks`, config).then((response) => {
                const result = response.data.result;
                const taskId = [];
                result.forEach(element => {
                    taskId.push(element._id);
                });
                setAllTaskId(taskId)
            }).catch((error) => {
                console.error('Error fetching users:', error);
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
                                {allRole && allRole?.map((roleData, index, array) => (
                                    <tr key={roleData.id}>
                                        <td>{roleData.role}</td>
                                        {/* {index == 0 ? console.log(array): null} */}
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
