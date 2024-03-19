import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const URL = process.env.BASE_URL || 'http://localhost:5000';

export default function ForgetPassword() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Password and confirm password must be the same');
      return;
    }

    const user = users.find(user => user.email === email);
    if (!user) {
      setError('User not found');
      return;
    }

    try {
      const updatedUser = { email: email, password: password };
      const response = await axios.put(`${URL}/user/updateuser/${user.email}`, updatedUser);

      if (response.status === 200) {
        alert('updated successfully');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigate('/login');
      } else {
        setError('Error while updating password');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  useEffect(() => {
    axios.get(`${URL}/user/getallusers`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <>
      <h1 className='heading'>Forget Password</h1>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <input className='Input' required value={email} onChange={handleEmailChange} placeholder='Email' />
          <input className='Input' required type='password' value={password} onChange={handlePasswordChange} placeholder='Password' />
          <input className='Input' required type='password' value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder='Confirm Password' />
          <button className='login-button' type='submit'>Submit</button>
        </form>
        {error && <div className="error-message">{typeof error === 'object' ? JSON.stringify(error) : error}</div>}
      </div>
    </>
  );
}
