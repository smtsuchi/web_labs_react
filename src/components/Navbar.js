import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../CurrentUserContext';

export default function Navbar() {
    const currentUser = useCurrentUser()
    return (
        <nav>
            <div></div>
            <div id='nav-center'>
                <Link  to='/'>Coding Summit Web Lab</Link>
                <div id='nav-right'>
                    {currentUser? <>{currentUser.username}</>:<></>}
                    <Link to='/login'><i className="fas fa-user-circle"/></Link>
                </div>
            </div>
            <div></div>
            
        </nav>
    )
}
