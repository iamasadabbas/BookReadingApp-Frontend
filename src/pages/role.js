import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "./axiosInstance";

const URL = process.env.BASE_URL || 'http://localhost:5000';
let config = {
    headers: { 'Content-Type': 'application/json' },
};


export default function Role() {
    const [roleInput, setRoleInput] = useState('');
    const [allTaskId, setAllTaskId] = useState([]);
    const [allRoleId, setAllRoleId] = useState([]);
    const navigate = useNavigate();

    const handleRoleChange = (e) => {
        setRoleInput(e.target.value);
    };

    useEffect(() => {
        addAllTask();
    },[allRoleId])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: { 'Content-Type': 'application/json' },
        };
        const response = await axiosInstance.post(`${URL}/role/addroles`, { role: roleInput }, config);
        if (response.status === 200) {
            alert('role added successfully')
            setRoleInput('')
            addAllTask();
            // console.log(response);
        } else {
            alert('error')
        }
    }
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
    
    useEffect(() => {
        axiosInstance.get(`${URL}/task/getalltasks`, config).then((response) => {
            // console.log(response.data.result);
            const result = response.data.result;
            const taskId = [];
            result.forEach(element => {
                taskId.push(element._id);
                // console.log(element._id);
            });
            setAllTaskId(taskId)
        }).catch((error) => {
            console.error('Error fetching users:', error);
        });
        axiosInstance.get(`${URL}/role/getallroles`, config).then((response) => {
            // console.log(response.data.result);
            const result = response.data.result;
            const RoleId = [];
            result.forEach(element => {
                RoleId.push(element._id);
                // console.log(element._id);
            });
            setAllRoleId(RoleId)
        }).catch((error) => {
            console.error('Error fetching users:', error);
        });
    },[roleInput]);
    
    return (
        <div >
            <h1 className='heading'>Add Role Here</h1>
            <div className="login-container">

                <form onSubmit={handleSubmit}>
                    <label>Role</label>
                    <input className='Input' value={roleInput} onChange={handleRoleChange} placeholder='type role here' />
                    <button className='login-button' type='submit'>Add</button>
                </form>
            </div>
        </div>
    )
}

