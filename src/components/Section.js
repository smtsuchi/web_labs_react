import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { useCurrentUser } from '../CurrentUserContext';

export default function Section(props) {
    const { coursename } = useParams()
    const section = props.section
    const [lessons, setLessons] = useState([{id:'',title:'',url_path:''}])
    const user = useCurrentUser()
    const completed_lessons = new Set(user.lessons)

    const getLessons = async (section) => {
        if (section.id === '') {return}
        const res = await fetch(`http://127.0.0.1:8000/lessons/${section.id}/`);
        const data = await res.json()
        setLessons(data)
      };
    useEffect(()=>{getLessons(section)},[section])
    const renderLesson = (lessons) => {
        return lessons.map((lesson, i)=>{
            return (
                <li className="accordion__list-item" key={`lesson_${lesson.id}`}>
                    <Link className={"lesson__checker "+(completed_lessons.has(lesson.id)?'lesson__complete':'lesson__incomplete')}  to={`/learn/${coursename}/${section.url_path}/${lesson.url_path}`}>{lesson.title}</Link>
                </li>
            )
        })
    }
    return (
        <div className='section' key={`section_${section.id}`}>
            <h2 >{section.title}</h2>
            <p>{section.description}</p>
            <input type='checkbox' name='section_accordion' id={section.url_path} className='accordion__input' />
            <label htmlFor={section.url_path} className='accordion__label'>Expand Section</label>
            <div className='accordion__content'>
                <ul>
                    {renderLesson(lessons)}
                </ul>
            </div>
        </div>
    )
}
