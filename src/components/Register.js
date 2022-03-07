import React from 'react';

export default function Register({ switchToSignin }) {
    return (
        <>
            <div className="signup inputGroup inputGroup1">
                <input type="text" id="username" name='username' className="username" maxLength="256" autoComplete="off"/>
                <p className="helper helper1">Username</p>
                <span className="indicator"></span>
            </div>
            <div className="signup inputGroup inputGroup1">
                <input type="text" id="email" name='email' className="email" maxLength="256" autoComplete="off"/>
                <p className="helper helper1">Email</p>
                <span className="indicator"></span>
            </div>
            <div className="signup inputGroup inputGroup2">
                <input type="password" name='password1' id="password" className="password" />
                <p className="helper helper1">Password</p>
            </div>
            <div className="signup inputGroup inputGroup2">
                <input type="password" name='password2' id="password2" className="password" />
                <p className="helper helper1">Confirm Password</p>
            </div>
            <div className="signup inputGroup inputGroup3">
                <button type='submit' id="login">Log in</button>
            </div>
            <div id="page-switch"  onClick={()=>{switchToSignin()}}><p>Already have an account? <span>Sign In</span></p></div>
        </>
    )
}
