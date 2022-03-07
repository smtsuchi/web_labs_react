import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../CurrentUserContext';
import DropdownMenu from './DropdownMenu';
import './Navbar.css';
import NavItem from './NavItem';

export default function Navbar() {
    const currentUser = useCurrentUser();
    const [showDropdown, setShowDropdown] = useState('');
    const toggleDropdown = () => {
        setShowDropdown(showDropdown? '' : 'nav__show-dropdown')
    };
    
      useEffect(()=>{
            window.addEventListener('click', toggleDropdown)
            return () => {window.removeEventListener('click', toggleDropdown)}
      })

    return (
        <nav>
            <div></div>
            <div id='nav-center'>
                <Link  to='/'>Coding Summit Web Lab</Link>
            </div>
            <div id='nav-right'>
                    {currentUser.token?
                    <>
                    {/* <div id='nav__dropdown' onClick={()=>toggleDropdown()}>
                        {currentUser.username}
                        <i className="fas fa-user-circle"/>
                    </div>
                    <ul className={`nav__dropdown ${showDropdown}`} aria-labelledby="dropdownMenuButton1">
                        <li><Link class="dropdown-item" to="/profile">Profile</Link></li>
                        <li onClick={()=>{logMeOut()}}><Link class="dropdown-item" to="/auth">Logout</Link></li>
                    </ul> */}
                    <NavItem icon={"🏂🏿"}>
                        
                        <DropdownMenu></DropdownMenu>
                    </NavItem>
                    
                    </>:
                        <Link to='/auth'>
                            Sign In
                            <i className="fas fa-user-circle"/>
                        </Link>
                        }
                </div>
            <div></div>
            
        </nav>
    )
}
