import React, { useEffect, useState } from 'react';
import { Link,useLocation } from 'react-router-dom';
import '../styles/Navbar.css'


function Navbar() {
    const [role, setRole] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const location=useLocation();
    useEffect(() => {
        console.log("Entered")
        const role = localStorage.getItem('role');
        const loggedIn = localStorage.getItem('loggedIn');
        if (role && loggedIn) {

            setRole(role);
            setLoggedIn(loggedIn);

        }
        else{
            setLoggedIn(false);
        }
    }, [location,loggedIn])

    return (
        <nav className='navbar'>
            <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/role">Role</Link></li>
                        <li><Link to="/task">Task</Link></li>
                        <li><Link to="/managetask">Manage Task</Link></li>
                        <li><Link to="/roletaskedit">Role Task Edit</Link></li>
                {loggedIn && (
                    <>
                        <li><Link to="/book">Book</Link></li>
                        { role == 'admin' && (
                            <>
                        <li><Link to="/user">User</Link></li>
                    </>
                )}
                    </>
                )}
                
                <li><Link to="/profile">Profile</Link></li>

            </ul>
        </nav>
    );
}

export default Navbar;
