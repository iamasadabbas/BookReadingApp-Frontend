import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "./axiosInstance";

const URL = process.env.BASE_URL || 'http://localhost:3000';


export default function Task() {
    const [taskInput, setTaskInput] = useState('');
    const navigate = useNavigate();

    const handleTaskChange = (e) => {
        setTaskInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: { 'Content-Type': 'application/json' },
        };
        const response = await axiosInstance.post(`${URL}/task/addtasks`, { task:taskInput }, config);
        if(response.status===200){
            alert('task added successfully')
            setTaskInput('')
            // console.log(response);
        }else{
            alert('error')
        }
    }
    return (
        <div >
            <h1 className='heading'>Add Task Here</h1>
        <div className="login-container">
            
            <form onSubmit={handleSubmit}>
                <label>Task</label>
                <input className='Input' value={taskInput}  onChange={handleTaskChange} placeholder='Add Task' />
                <button className='login-button' type='submit'>Add</button>
            </form>
        </div>
        </div>
    )
}

