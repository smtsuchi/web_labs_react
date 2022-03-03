import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useSetCurrentUser } from '../../CurrentUserContext';

export default function Login() {
    const setCurrentUser = useSetCurrentUser();
    const getCompletedLessons = async (token) => {
        const res = await fetch("http://127.0.0.1:8000/api/get-completed-lessons/", {
          method: "GET",
          headers: {"Authorization": `Token ${token}`}
        });
        const data = await res.json();
        return data
      };
    const getUser = async (username, password) => {
        const res = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
        const data = await res.json();
        return data
    };

    const [redirect, setRedirect] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value
        const password = e.target.password1.value
        const data = await getUser(username, password)    
        console.log(data, 'data')    
        if (!data.token){
            alert("Incorrect username or password.")
            return
        };
        const lessons = await getCompletedLessons(data.token);
        console.log('lessons', lessons)
        const user = {
            token: data.token,
            username,
            lessons
        };

        setCurrentUser(user);
        console.log(user)
        localStorage.setItem('user', JSON.stringify(user));
        setRedirect(true);
    };

    return (
        redirect ? <Navigate to='/' /> :
            <>
                <div className="form-border-box">
                    <h2>Login</h2>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="id_username" className="form-label">Username :</label>
                            <input type="text" name="username" maxLength="150" className="form-control" id="id_username" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="id_password1" className="form-label">Password :</label>
                            <input type="password" name="password1" autoComplete="new-password" maxLength="150" className="form-control" id="id_password1" />
                        </div>
                        <input type="submit" className="btn btn-primary" value="Submit" />
                    </form>
                </div>
                <div className="mt-2 text-center">Don't have an account? <Link className="text-decoration-none" to="/register">Register</Link></div>
            </>
    )
}
