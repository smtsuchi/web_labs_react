import React, { useState, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

// icons
import { ReactComponent as BellIcon } from './icons/bell.svg';
import { ReactComponent as MessengerIcon } from './icons/messenger.svg';
import { ReactComponent as CaretIcon } from './icons/caret.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as CogIcon } from './icons/cog.svg';
import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as ArrowIcon } from './icons/arrow.svg';
import { ReactComponent as BoltIcon } from './icons/bolt.svg';
import { ReactComponent as SkiiIcon } from './icons/skii.svg';
import { ReactComponent as JSIcon } from './icons/js.svg';
import { ReactComponent as PythonIcon } from './icons/python.svg';
import { ReactComponent as CSSIcon } from './icons/css3.svg';
import { ReactComponent as HTMLIcon } from './icons/html5.svg';
import { useSetCurrentUser } from '../CurrentUserContext';
import { Link } from 'react-router-dom';

export default function DropdownMenu() {
  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
  }, []);

  const logMeOut = () => {
    setCurrentUser({token:'',username:'', lessons: []})
    localStorage.removeItem('codingsummit_user');
  };

  const calcHeight = (el) => {
    const height = el.offsetHeight;
    setMenuHeight(height);
  };

  const DropdownItem = (props) => {
    return (
      <p className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className={props.rightIcon?"icon-right icon-button":''}>{props.rightIcon}</span>
      </p>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>

      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <Link to='/profile'><DropdownItem>Profile</DropdownItem></Link>
          <DropdownItem
            leftIcon={<CogIcon />}
            rightIcon={<ChevronIcon />}
            goToMenu="settings">
            Settings
          </DropdownItem>
          <DropdownItem
            leftIcon="🦧"
            rightIcon={<ChevronIcon />}
            goToMenu="courses">
            Courses
          </DropdownItem>
          <Link onClick={() =>{logMeOut()}} to='/auth'>
            <DropdownItem leftIcon={<SkiiIcon />}>
              Log Out
            </DropdownItem>
          </Link>

        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'settings'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
            <h2>My Tutorial</h2>
          </DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>HTML</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>CSS</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>JavaScript</DropdownItem>
          <DropdownItem leftIcon={<BoltIcon />}>Awesome!</DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        in={activeMenu === 'courses'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
            <h2>Courses</h2>
          </DropdownItem>
          <Link to='/learn/intro-to-the-world-of-javascript'>
            <DropdownItem leftIcon={<JSIcon />}>JavaScript</DropdownItem>
          </Link>
          <Link to='/learn/introduction-to-python'>
            <DropdownItem leftIcon={<PythonIcon />}>Python</DropdownItem>
          </Link>
          <Link to='/learn/html-learn-web-development'>
            <DropdownItem leftIcon={<HTMLIcon />}>HTML</DropdownItem>
          </Link>
          <Link to='/learn/css-styling-basics'>
            <DropdownItem leftIcon={<CSSIcon />}>CSS</DropdownItem>
          </Link>
        </div>
      </CSSTransition>
    </div>
  )
}
