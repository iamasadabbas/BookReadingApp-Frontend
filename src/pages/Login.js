import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "./axiosInstance";

const URL = process.env.BASE_URL || 'http://localhost:3000';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem('loggedIn');
        if (loggedIn === 'true') {
            setLogin(true);
        }
    }, []);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleForgetClick = () => {
        navigate('/forgetpassword');
    };

    const handleLogOut = () => {
        let config = {
            headers: { 'Content-Type': 'application/json' },
        };
        axiosInstance.get(`${URL}/user/logout`, config)
            .then(() => {
                const itemsToRemove = ['loggedIn', 'role', 'userId', 'bookId', 'bookmarkedPage', 'url'];

                for (const item of itemsToRemove) {
                    localStorage.removeItem(item);
                }
                setLogin(false);
                navigate('/profile');
            })
            .catch(error => console.error('Logout failed:', error));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await axiosInstance.post(`${URL}/user/loginuser`, { username, password }, config);

            if (response.data.status === 200) {
                setLogin(true);
                navigate('/')
                const userId = response.data.userId;
                const role = response.data.role;
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userId', userId);
                localStorage.setItem('role', role);
                setUsername('');
                setPassword('');
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            setError(error);
        }
    };

    return (
        <>
            <h1 className='heading'>Login</h1>
            <div className="login-container">
                {!login ? (
                    <>
                        <form onSubmit={handleSubmit}>
                            <input className='Input' value={username} onChange={handleUsernameChange} placeholder='Username' />
                            <input className='Input' type='password' value={password} onChange={handlePasswordChange} placeholder='Password' />
                            <button className='login-button' type='submit'>Log in</button>
                        </form>
                        <p>Forget Password? <a className='signup-link' onClick={handleForgetClick}>Forget Password</a></p>
                        <p>Don't have an account? <a className='signup-link' onClick={handleSignUpClick}>Sign up</a></p>
                    </>
                ) : (
                    <button className='login-button' onClick={handleLogOut}>Log Out</button>
                )}
                {error && <div className="error-message" >{typeof error === 'object' ? JSON.stringify(error) : error}</div>}
            </div>
        </>
    );
}
