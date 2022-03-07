import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import './Courses.css';


export default function Courses(props) {

    const [quote, setQuote] = useState({ text: '', author: '' });
    const [courses, setCourses] = useState([{ id: '', title: '', icon: '', url_path: '', description: '' }]);

    const getQuote = async () => {
        const res = await fetch("https://type.fit/api/quotes");
        const data = await res.json();
        const rand_quote = data[Math.floor(Math.random() * data.length)];

        setQuote(rand_quote);
    }
    const getCourses = async () => {
        const res = await fetch("http://127.0.0.1:8000/courses/");
        const data = await res.json()
        // data.forEach(async (course) => {course.sections = await getSections(course.id)})

        setCourses(data)
    };

    useEffect(() => { getQuote() }, [])
    useEffect(() => { getCourses() }, [])

        const renderCourse = () => {
        return courses.map((course) => {
            return (
                <Tilt key={`course_${course.id}`} className='course-tilt' glareEnable={true} glareBorderRadius={"15px"} perspective={800}>
                    <Link className="course-card" to={`/learn/${course.url_path}`}>
                        <div className='course-content'>
                            <h3>{course.title}</h3>
                        </div>
                        <div className='course-icon-container'>
                            <i className={`fab ${course.icon}`}></i>
                        </div>
                        <div className='course-hover'>
                            <h2>Begin</h2>
                            <div id="arrowAnim">
                                <div className="arrowSliding">
                                    <div className="arrow"></div>
                                </div>
                                <div className="arrowSliding delay1">
                                    <div className="arrow"></div>
                                </div>
                                <div className="arrowSliding delay2">
                                    <div className="arrow"></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </Tilt>
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
            {/* <ul>
                {renderCourse()}
            </ul> */}
            <div className='course-container'>
                {renderCourse()}
            </div>
        </div>
    )
}
