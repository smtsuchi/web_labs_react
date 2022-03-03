import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function Courses(props) {

    const [quote, setQuote] = useState({text:'',author:''});
    const [courses, setCourses] = useState([{id:'',title:'',icon:'',url_path:'',description:''}]);

    const getQuote = async () => {
        const res = await fetch("https://type.fit/api/quotes");
        const data = await res.json();
        const rand_quote = data[Math.floor(Math.random()*data.length)];
        
        setQuote(rand_quote);
    }
    const getCourses = async () => {
        const res = await fetch("http://127.0.0.1:8000/courses/");
        const data = await res.json()
        // data.forEach(async (course) => {course.sections = await getSections(course.id)})

        setCourses(data)
      };
    
    useEffect(()=>{getQuote()}, [])
    useEffect(()=>{getCourses()},[])

    const renderCourse = () => {
        return courses.map((course)=>{
            return (
                <li key={`course_${course.id}`}>
                    
                    <Link className="course-btn" to={`/learn/${course.url_path}`}>
                        <i className={`fab ${course.icon}`}></i>
                        {course.title}
                    </Link>
                </li>
            )
        })
    }

    return (
        <div>
            <h1 >Welcome to Coding Summit's Web Lab!</h1>
            <Link className="course-btn curr-challenge" to='/'><p>Go to current challenge</p></Link>
            <blockquote>
                <q>{quote.text}</q>
                
                <cite> - {quote.author}</cite>
            </blockquote>
            <ul>
                {renderCourse()}
            </ul>
        </div>
    )
}
