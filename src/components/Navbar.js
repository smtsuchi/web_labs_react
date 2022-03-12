import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../CurrentUserContext';
import DropdownMenu from './DropdownMenu';
import './Navbar.css';
import NavItem from './NavItem';
import { ReactComponent as UserIcon } from './icons/user-solid.svg'

export default function Navbar() {
    const currentUser = useCurrentUser();


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
                    <NavItem icon={<UserIcon />}>
                        <DropdownMenu  ></DropdownMenu>
                    </NavItem>
                    
                    </>:
                        <Link  to='/auth'>
                            
                            <h4 className='login'>Log In</h4>
                            
                        </Link>
                        }
                </div>
            <div></div>
            
        </nav>
    )
}
