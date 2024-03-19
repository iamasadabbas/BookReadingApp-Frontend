import React, { useState, useEffect } from 'react';
import '../styles/Book.css';
import axiosInstance from './axiosInstance';
let config = {
  headers: { 'Content-Type': 'application/json' },
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000'

export default function User() {
  const taskName='view'
  const [users, setUsers] = useState([]);
  const [inputUserName, setInputUserName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [heading, setHeading] = useState('Add Users');
  const [logintext, setLoginText] = useState('');
  const [currentRoleId, setCurrentRoleId] = useState('');
  const [currentTaskId, setCurrentTaskId] = useState('');
  const [access, setAccess] = useState('');


  const editEntry = async (user) => {
    setInputUserName(user.username);
    setInputEmail(user.email);
    setInputPassword(user.password);
    setEditingUser(user);
    setHeading('Update User here')
  }

  const handleUpdate = async () => {
    const updatedUser = { username: inputUserName, email: inputEmail, password: inputPassword };
    // alert(updatedUser.username)
    try {
      await axiosInstance.put(`${BASE_URL}/user/updateuser/${editingUser._id}`, updatedUser, config);
      const response = await axiosInstance.get(`${BASE_URL}/user/getallusers`, config);
      // alert(response.data);
      setUsers(response.data);
      alert(' udpated successfully');
      setInputUserName('');
      setInputEmail('');
      setInputPassword('')
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating User:', error);
      // alert('Failed to update User');
    }
  }

  const deleteEntry = (id) => {
    axiosInstance.delete(`${BASE_URL}/user/deleteuser/${id}`).then(() => {
      axiosInstance.get(`${BASE_URL}/user/getallusers`, config).then((response) => {
        setUsers(response.data);
      });
    }).catch((error) => {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    });
  }

  const handleChangeUserName = (val) => {
    setInputUserName(val.target.value);
  }
  const handleChangeEmail = (val) => {
    setInputEmail(val.target.value);
  }
  const handleChangePassword = (val) => {
    setInputPassword(val.target.value);
  }

  const handleSubmit = async () => {
    const requestData = {
      username: inputUserName,
      email: inputEmail,
      password: inputPassword
    };
    try {
      const response = await axiosInstance.post(`${BASE_URL}/user/postuser`, requestData, config);
      if (response.status === 200) {
        alert('Data added successfully');
        setInputUserName('');
      } else {
        console.error("Error while saving data");
      }
    } catch (error) {
      console.error("Error while saving data:", error);
      alert('Failed to add user');
    }
  }


  useEffect(() => {
    axiosInstance.get(`${BASE_URL}/user/getallusers`, config).then((response) => {
      // console.log(response.data);
      if (response?.data?.message === "Not authorized") {
        // alert('please login to get all users')
        setUsers([]);
        setLoginText('login first to see all users')
      }
      else {
        setUsers(response.data);

      }

    }).catch((error) => {
      console.error('Error fetching users:', error);
    });
  }, []);
  useEffect(() => {
    const role = localStorage.getItem('role')
    // console.log(role);
    axiosInstance.get(`${BASE_URL}/role/getrolebyrolename/${role}`, config).then((response) => {
      setCurrentRoleId(response.data[0]._id);
      // console.log(response.data[0]._id);
    })
    axiosInstance.get(`${BASE_URL}/task/gettaskbytaskname/${taskName}`, config).then((response) => {
      setCurrentTaskId(response.data.id);
      // console.log(response);
    })
    },[])
    useEffect(() =>{
      // console.log(currentRoleId);
      // console.log(currentTaskId);
      if (!currentRoleId || !currentTaskId) return;
      try {
        axiosInstance.post(`${BASE_URL}/managetask/getstatusbytaskidandroleid`, {
          roleId: currentRoleId,
          taskId: currentTaskId
        }, config)
        .then((response) => {
          // console.log(response.data); // Update UI based on fetched status
          setAccess(response.data)
        })
        .catch((error) => {
          console.error('Error fetching status:', error);
          // Handle error gracefully (display error message, etc.)
        });
      } catch (error) {
        console.error('Error in status fetching logic:', error);
      }
    }, [currentRoleId, currentTaskId])
    
  return (
    <div className='body'>
      {access && (
      <div>{!users.length == 0 ? (
        <>
          <h2 className='heading'>User data</h2>
          <div className='container'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th colSpan='2'>Operation</th>
                </tr>
              </thead>
              <tbody>
                {users && users?.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>
                      <button className='del-button' onClick={() => { deleteEntry(user._id) }}>Delete</button>
                    </td>
                    <td>
                      <button className='edit-button' onClick={() => { editEntry(user) }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h1 className='heading'>{heading}</h1>
          <div className='container'>
            <form onSubmit={editingUser ? handleUpdate : handleSubmit} className='large-form'>
              <label className='label'>Username</label>
              <input className='input' required type='text' value={inputUserName} onChange={handleChangeUserName} placeholder='Enter username here' />
              <br />
              <label className='label'>Email</label>
              <input className='input' required type='email' value={inputEmail} onChange={handleChangeEmail} placeholder='Enter email here' />
              <br />
              <label className='label'>Password</label>
              <input className='input' required type='password' value={inputPassword} onChange={handleChangePassword} placeholder='Enter password here' />
              <br />
              <button className='button' type='submit'>{editingUser ? 'Update' : 'Submit'}</button>
            </form>
          </div>
        </>) : (
        <div>
          <p>{logintext}</p>
        </div>
      )}
      </div>
      )}
    </div>
  );
}

