import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Section from '../components/Section';

export default function CourseInfo(props) {
    const { coursename } = useParams()
    const [course, setCourse] = useState({title:'',icon:'',description:'',id:''})
    const [sections, setSections] = useState([{id:''}])
    const getCourse = async (coursename) => {
        const res = await fetch(`http://127.0.0.1:8000/courses/${coursename}/`);
        const data = await res.json()
        setCourse(data)
      };
    const getSections = async (course) => {
        if (course.id === '') {return}
        const res = await fetch(`http://127.0.0.1:8000/sections/${course.id}/`);
        const data = await res.json()
        setSections(data)
      };
    useEffect(()=>{getCourse(coursename)},[coursename])
    useEffect(()=>{getSections(course)},[course])
    
    const parseDescription = () => {
        return course.description.split('\n').map((d,i)=>{return (<div className="course-description" key={i}>{d}<br/></div>)})
    }
    const renderSection = () => {
        return sections.map((section)=>{
            return (
                <Section section={section} />
            )
        })
    }
    return (
        <div className='no-select'>
            <h1>{course.title}</h1>
            <i className={`fab ${course.icon}`}></i>
            {parseDescription()}
            <div className='section__container'>
                {renderSection()}
            </div>
        </div>
    )
}
