import React from 'react'
import { Navigate, useParams } from 'react-router-dom'

export default function Re() {

    const {coursename, sectionname, lessonname} = useParams()
    console.log('made it')
  return (
    <Navigate to={`/learn/${coursename}/${sectionname}/${lessonname}`}/> 
  )
}
