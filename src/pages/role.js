import React, { useState, useEffect } from 'react';
import axiosInstance from "./axiosInstance";

const URL = process.env.BASE_URL || 'http://localhost:3000';
let config = {
    headers: { 'Content-Type': 'application/json' },
};

export default function Role() {
    const [roleInput, setRoleInput] = useState('');

    const handleRoleChange = (e) => {
        setRoleInput(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: { 'Content-Type': 'application/json' },
        };
        const response = await axiosInstance.post(`${URL}/role/addroles`, { role: roleInput }, config);
        if (response.status === 200) {
            alert('role added successfully')
            setRoleInput('')
        } else {
            alert('error')
        }
    }

    
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

