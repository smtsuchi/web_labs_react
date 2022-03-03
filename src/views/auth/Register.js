import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

export default function Register() {
    const [redirect, setRedirect] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value
        const email = e.target.email.value
        const password = e.target.password1.value
        const password2 = e.target.password2.value
        if (password !== password2){
            console.log("passwords don't match")
            return
        }
        const res = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password":password,
                "password2": password2
            })
        });
        const data = await res.json();
        console.log(data);
        setRedirect(true);
    };
    return (
        redirect ? <Navigate to='/login' /> :
        <>
        <div className="form-border-box">
            <h2>Register</h2>
            <form onSubmit={(e)=>handleSubmit(e)}>
                <div className="mb-3">
                    <label htmlFor="id_username" className="form-label">Username :</label>
                    <input type="text" name="username" maxLength="150" className="form-control" id="id_username" />
                </div>
                <div className="mb-3">
                    <label htmlFor="id_email" className="form-label">Email :</label>
                    <input type="text" name="email" maxLength="150" className="form-control" id="id_email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="id_password1" className="form-label">Password :</label>
                    <input type="password" name="password1" autoComplete="new-password" maxLength="150" className="form-control" id="id_password1" />
                </div>
                <div className="mb-3">
                    <label htmlFor="id_password2" className="form-label">Password confirmation :</label>
                    <input type="password" name="password2" autoComplete="new-password" maxLength="150" className="form-control" id="id_password2" />
                </div>
                <input type="submit" className="btn btn-primary" value="Submit" />
            </form>
        </div>
        <div className="mt-2 text-center">Already have an account? <Link className="text-decoration-none" to="/login">Login</Link></div>
    </>
    )
}
