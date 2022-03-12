import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import PolyBackground from './components/PolyBackground';
import Re from './components/Re';
import {  useSetCurrentUser } from './CurrentUserContext';
import NotFoundPage from './views/404/NotFoundPage';
import Auth from './views/auth/Auth';
import CourseInfo from './views/CourseInfo';
import Courses from './views/Courses';
import Lesson from './views/Lesson';
import './components/Skies.css';
import Mountain from './components/Mountain';


export default function App() {
  const user = localStorage.getItem('codingsummit_user');
  const setCurrentUser = useSetCurrentUser()
  useEffect(()=>{
    if (user){setCurrentUser(JSON.parse(user))}
    return () => {
      if (user){
        localStorage.setItem('codingsummit_user', JSON.stringify(user));
      }
    }
  },[user, setCurrentUser]);

  return (
    <>
      <Navbar/>
      {/* <PolyBackground /> */}
      {/* <div class="sky-gradient sky-gradient-12"></div> */}
      <Suspense fallback={null}>
        < Mountain />
      </Suspense>
      <div className="main">
        <Routes>
          <Route exact path='/' element={<Courses />}/>
          <Route exact path='/learn/:coursename' element={<CourseInfo />}/>
          <Route exact path='/learn/:coursename/:sectionname/:lessonname' element={<Lesson />}/>
          <Route exact path='/re/:coursename/:sectionname/:lessonname' element={<Re />}/>

          <Route exact path='/auth' element={<Auth/>}/>
          <Route exact path='/register' element={<Auth />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      
    </>
  )
}
