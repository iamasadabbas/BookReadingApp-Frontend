import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
    const [role, setRole] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedLoggedIn = localStorage.getItem('loggedIn');
        if (storedRole && storedLoggedIn) {
            setRole(storedRole);
            setLoggedIn(storedLoggedIn === 'true');
        } else {
            setLoggedIn(false);
        }
    }, [location]);

    return (
        <nav className='navbar'>
            <ul>
                <li><Link to="/">Home</Link></li>
                
                {!loggedIn ? (
                    <li><Link to="/profile">Profile</Link></li>
                ) : (
                    <>
                        {role === "user" && (
                            <>
                                <li><Link to="/book">Books</Link></li>
                                <li><Link to="/profile">Profile</Link></li>
                            </>
                        )}
                        {role === "admin" && (
                            <>
                                <li><Link to="/role">Role</Link></li>
                                <li><Link to="/task">Task</Link></li>
                                <li><Link to="/roletaskedit">Role Task Edit</Link></li>
                                <li><Link to="/book">Books</Link></li>
                                <li><Link to="/user">User</Link></li>
                                <li><Link to="/profile">Profile</Link></li>
                            </>
                        )}
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
