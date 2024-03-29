import React, { useState, useEffect } from 'react';
import {useLocation } from 'react-router-dom';
import axiosInstance from "../pages/axiosInstance";

const URL = process.env.BASE_URL || 'http://localhost:5000';
let config = {
    headers: { 'Content-Type': 'application/json' },
};

export default function GetAllEditTask() {
    const [allTaskId, setAllTaskId] = useState([]);
    const [allRoleId, setAllRoleId] = useState([]);
    const location = useLocation();

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
    
    useEffect(() => {
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
        axiosInstance.get(`${URL}/role/getallroles`, config).then((response) => {
            const result = response.data.result;
            const RoleId = [];
            result.forEach(element => {
                RoleId.push(element._id);
            });
            setAllRoleId(RoleId)
        }).catch((error) => {
            console.error('Error fetching users:', error);
        });
    },[location]);
    
}