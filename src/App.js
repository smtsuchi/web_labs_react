import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Re from './components/Re';
import { useCurrentUser, useSetCurrentUser } from './CurrentUserContext';
import NotFoundPage from './views/404/NotFoundPage';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import CourseInfo from './views/CourseInfo';
import Courses from './views/Courses';
import Lesson from './views/Lesson';



export default function App() {
  const user = localStorage.getItem('user');
  const setCurrentUser = useSetCurrentUser()
  const currentUser = useCurrentUser()
  useEffect(()=>{if (user){setCurrentUser(JSON.parse(user))}},[user, setCurrentUser]);


  const getCompletedLessons = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/get-completed-lessons/", {
      method: "GET",
      headers: {"Authorization": `Token ${currentUser.token}`}
    });
    const data = await res.json();
    console.log(data);
  };


  return (
    <>
      <Navbar/>
      
      <div className="main">
        <Routes>
          <Route exact path='/' element={<Courses />}/>
          <Route exact path='/learn/:coursename' element={<CourseInfo />}/>
          <Route exact path='/learn/:coursename/:sectionname/:lessonname' element={<Lesson />}/>
          <Route exact path='/re/:coursename/:sectionname/:lessonname' element={<Re />}/>

          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/register' element={<Register />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  )
}
