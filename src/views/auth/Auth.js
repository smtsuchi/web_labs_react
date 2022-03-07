import React, { useState, useEffect } from 'react';
import {  Navigate } from 'react-router-dom';
import { useSetCurrentUser } from '../../CurrentUserContext';
import './Auth.css';
import './Auth.scss';
import './Backdrop.css';
import {ReactComponent as Yeti} from './YetiSVG.svg';
import Login from '../../components/Login';
import { motion} from 'framer-motion/dist/framer-motion'
import Register from '../../components/Register';
import Tilt from 'react-parallax-tilt';
import CodingSummitLogo from './codingsummit-logo-transparent.png';

const backdropVariants = {
    expanded: {
      width: "245%",
      height: "1300px",
      borderRadius: "15%",
      transform: "rotate(60deg)",
    },
    collapsed: {
      width: "160%",
      height: "550px",
      borderRadius: "50%",
      transform: "rotate(60deg)",
    },
  };
  
const expandingTransition = {
    type: "spring",
    duration: 2.3,
    stiffness: 30,
  };

export default function Auth() {
    const setCurrentUser = useSetCurrentUser();

    const [isExpanded, setExpanded] = useState(false);
    const [active, setActive] = useState("signin");


    const getCompletedLessons = async (token) => {
        const res = await fetch("http://127.0.0.1:8000/api/get-completed-lessons/", {
            method: "GET",
            headers: { "Authorization": `Token ${token}` }
        });
        const data = await res.json();
        return data
    };
    const getUser = async (username, password) => {
        const res = await fetch("http://127.0.0.1:8000/api/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
        const data = await res.json();
        return data
    };

    const [redirect, setRedirect] = useState(false)

    const signUpUser = async (e) => {
        e.preventDefault();
        const username = e.target.username.value
        const email = e.target.email.value
        const password = e.target.password1.value
        const password2 = e.target.password2.value
        if (password !== password2){
            alert("passwords don't match")
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
        switchToSignin()
    };

    const signInUser = async (e) => {
        e.preventDefault();
        const username = e.target.username.value
        const password = e.target.password1.value
        const data = await getUser(username, password)
        console.log(data, 'data')
        if (!data.token) {
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
        localStorage.setItem('codingsummit_user', JSON.stringify(user));
        setRedirect(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        active === 'signin'? signInUser(e):signUpUser(e)
    };

    /* --  ANIMATION  -- */
    const TweenMax = window.TweenMax;
    const Quad = window.Quad;
    const Expo = window.Expo;
    let username, email, password, password2, mySVG, armL, armR, eyeL, eyeR, nose, mouth, mouthBG, mouthSmallBG, mouthMediumBG, mouthLargeBG, mouthMaskPath, mouthOutline, tooth, tongue, chin, face, eyebrow, outerEarL, outerEarR, earHairL, earHairR, hair;
    let caretPos,  curElemIndex, screenCenter, svgCoords, eyeMaxHorizD = 20, eyeMaxVertD = 10, noseMaxHorizD = 23, noseMaxVertD = 10, dFromC, eyeDistH, mouthStatus = "small";
    

    function getCoord(elem, e) {
        let 	carPos = elem.selectionEnd,
            div = document.createElement('div'),
            span = document.createElement('span'),
            copyStyle = getComputedStyle(elem),
            elemCoords = {}, caretCoords = {}, centerCoords = {}
        ;
        [].forEach.call(copyStyle, function(prop){
            div.style[prop] = copyStyle[prop];
        });
        div.style.position = 'absolute';
        document.body.appendChild(div);
        div.textContent = elem.value.substr(0, carPos);
        span.textContent = elem.value.substr(carPos) || '.';
        div.appendChild(span);
        
        elemCoords = getPosition(elem);							//console.log("elemCoords.x: " + elemCoords.x + ", elemCoords.y: " + elemCoords.y);
        caretCoords = getPosition(span);							//console.log("caretCoords.x " + caretCoords.x + ", caretCoords.y: " + caretCoords.y);
        centerCoords = getPosition(mySVG);							//console.log("centerCoords.x: " + centerCoords.x);
        svgCoords = getPosition(mySVG);
        screenCenter = centerCoords.x + (mySVG.offsetWidth / 2);		//console.log("screenCenter: " + screenCenter);
        caretPos = caretCoords.x + elemCoords.x;					//console.log("caretPos: " + caretPos);
        
        dFromC = screenCenter - caretPos; 							//console.log("dFromC: " + dFromC);
        let pFromC = Math.round((caretPos / screenCenter) * 100) / 100;
        if(pFromC < 1) {
            
        } else if(pFromC > 1) {
            pFromC -= 2;
            pFromC = Math.abs(pFromC);
        }
    
        eyeDistH = -dFromC * .05;
        if(eyeDistH > eyeMaxHorizD) {
            eyeDistH = eyeMaxHorizD;
        } else if(eyeDistH < -eyeMaxHorizD) {
            eyeDistH = -eyeMaxHorizD;
        }
        
        let eyeLCoords = {x: svgCoords.x + 84, y: svgCoords.y + 76};
        let eyeRCoords = {x: svgCoords.x + 113, y: svgCoords.y + 76};
        let noseCoords = {x: svgCoords.x + 97, y: svgCoords.y + 81};
        let mouthCoords = {x: svgCoords.x + 100, y: svgCoords.y + 100};
        let eyeLAngle = getAngle(eyeLCoords.x, eyeLCoords.y, elemCoords.x + caretCoords.x, elemCoords.y + 25);
        let eyeLX = Math.cos(eyeLAngle) * eyeMaxHorizD;
        let eyeLY = Math.sin(eyeLAngle) * eyeMaxVertD;
        let eyeRAngle = getAngle(eyeRCoords.x, eyeRCoords.y, elemCoords.x + caretCoords.x, elemCoords.y + 25);
        let eyeRX = Math.cos(eyeRAngle) * eyeMaxHorizD;
        let eyeRY = Math.sin(eyeRAngle) * eyeMaxVertD;
        let noseAngle = getAngle(noseCoords.x, noseCoords.y, elemCoords.x + caretCoords.x, elemCoords.y + 25);
        let noseX = Math.cos(noseAngle) * noseMaxHorizD;
        let noseY = Math.sin(noseAngle) * noseMaxVertD;
        let mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, elemCoords.x + caretCoords.x, elemCoords.y + 25);
        let mouthX = Math.cos(mouthAngle) * noseMaxHorizD;
        let mouthY = Math.sin(mouthAngle) * noseMaxVertD;
        let mouthR = Math.cos(mouthAngle) * 6;
        let chinX = mouthX * .8;
        let chinY = mouthY * .5;
        let chinS = 1 - ((dFromC * .15) / 100);
        if(chinS > 1) {chinS = 1 - (chinS - 1);}
        let faceX = mouthX * .3;
        let faceY = mouthY * .4;
        let faceSkew = Math.cos(mouthAngle) * 5;
        let eyebrowSkew = Math.cos(mouthAngle) * 25;
        let outerEarX = Math.cos(mouthAngle) * 4;
        let outerEarY = Math.cos(mouthAngle) * 5;
        let hairX = Math.cos(mouthAngle) * 6;
        let hairS = 1.2;
        
        TweenMax.to(eyeL, 1, {x: -eyeLX , y: -eyeLY, ease: Expo.easeOut});
        TweenMax.to(eyeR, 1, {x: -eyeRX , y: -eyeRY, ease: Expo.easeOut});
        TweenMax.to(nose, 1, {x: -noseX, y: -noseY, rotation: mouthR, transformOrigin: "center center", ease: Expo.easeOut});
        TweenMax.to(mouth, 1, {x: -mouthX , y: -mouthY, rotation: mouthR, transformOrigin: "center center", ease: Expo.easeOut});
        TweenMax.to(chin, 1, {x: -chinX, y: -chinY, scaleY: chinS, ease: Expo.easeOut});
        TweenMax.to(face, 1, {x: -faceX, y: -faceY, skewX: -faceSkew, transformOrigin: "center top", ease: Expo.easeOut});
        TweenMax.to(eyebrow, 1, {x: -faceX, y: -faceY, skewX: -eyebrowSkew, transformOrigin: "center top", ease: Expo.easeOut});
        TweenMax.to(outerEarL, 1, {x: outerEarX, y: -outerEarY, ease: Expo.easeOut});
        TweenMax.to(outerEarR, 1, {x: outerEarX, y: outerEarY, ease: Expo.easeOut});
        TweenMax.to(earHairL, 1, {x: -outerEarX, y: -outerEarY, ease: Expo.easeOut});
        TweenMax.to(earHairR, 1, {x: -outerEarX, y: outerEarY, ease: Expo.easeOut});
        TweenMax.to(hair, 1, {x: hairX, scaleY: hairS, transformOrigin: "center bottom", ease: Expo.easeOut});
        
        document.body.removeChild(div);
    };
    
    function onElemInput(e) {
        
        let value = e.target.value;
        curElemIndex = value.length;
        getCoord(e.target, e);
        
        // very crude email validation for now to trigger effects
        if(curElemIndex > 0) {
            if(mouthStatus === "small") {
                mouthStatus = "medium";
                TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, {morphSVG: mouthMediumBG, shapeIndex: 8, ease: Expo.easeOut});
                TweenMax.to(tooth, 1, {x: 0, y: 0, ease: Expo.easeOut});
                TweenMax.to(tongue, 1, {x: 0, y: 1, ease: Expo.easeOut});
                TweenMax.to([eyeL, eyeR], 1, {scaleX: .85, scaleY: .85, ease: Expo.easeOut});
            }
            if(value.includes("@")) {
                mouthStatus = "large";
                TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, {morphSVG: mouthLargeBG, ease: Expo.easeOut});
                TweenMax.to(tooth, 1, {x: 3, y: -2, ease: Expo.easeOut});
                TweenMax.to(tongue, 1, {y: 2, ease: Expo.easeOut});
                TweenMax.to([eyeL, eyeR], 1, {scaleX: .65, scaleY: .65, ease: Expo.easeOut, transformOrigin: "center center"});
            } else {
                mouthStatus = "medium";
                TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, {morphSVG: mouthMediumBG, ease: Expo.easeOut});
                TweenMax.to(tooth, 1, {x: 0, y: 0, ease: Expo.easeOut});
                TweenMax.to(tongue, 1, {x: 0, y: 1, ease: Expo.easeOut});
                TweenMax.to([eyeL, eyeR], 1, {scaleX: .85, scaleY: .85, ease: Expo.easeOut});
            }
        } else {
            mouthStatus = "small";
            TweenMax.to([mouthBG, mouthOutline, mouthMaskPath], 1, {morphSVG: mouthSmallBG, shapeIndex: 9, ease: Expo.easeOut});
            TweenMax.to(tooth, 1, {x: 0, y: 0, ease: Expo.easeOut});
            TweenMax.to(tongue, 1, {y: 0, ease: Expo.easeOut});
            TweenMax.to([eyeL, eyeR], 1, {scaleX: 1, scaleY: 1, ease: Expo.easeOut});
        }
    }
    
    function onElemFocus(e) {
        e.target.parentElement.classList.add("focusWithText");
        getCoord(e.target);
    }
    
    function onElemBlur(e) {
        if(e.target.value === "") {
            e.target.parentElement.classList.remove("focusWithText");
        }
        resetFace();
    }
    
    function onPasswordFocus(e) {
        e.target.parentElement.classList.add("focusWithText");
        coverEyes();
    }
    
    function onPasswordBlur(e) {
        if(e.target.value === "") {
            e.target.parentElement.classList.remove("focusWithText");
        }
        uncoverEyes();
    }
    
    function coverEyes() {
        TweenMax.to(armL, .45, {x: -93, y: 2, rotation: 0, ease: Quad.easeOut, delay:.1});
        TweenMax.to(armR, .45, {x: -93, y: 2, rotation: 0, ease: Quad.easeOut, delay:.1});
    }
    
    function uncoverEyes() {
        TweenMax.to(armL, 1.35, {y: 220, ease: Quad.easeOut});
        TweenMax.to(armL, 1.35, {rotation: 105, ease: Quad.easeOut, delay: .1});
        TweenMax.to(armR, 1.35, {y: 220, ease: Quad.easeOut});
        TweenMax.to(armR, 1.35, {rotation: -105, ease: Quad.easeOut, delay: .1});
    }
    
    function resetFace() {
        TweenMax.to([eyeL, eyeR], 1, {x: 0, y: 0, ease: Expo.easeOut});
        TweenMax.to(nose, 1, {x: 0, y: 0, scaleX: 1, scaleY: 1, ease: Expo.easeOut});
        TweenMax.to(mouth, 1, {x: 0, y: 0, rotation: 0, ease: Expo.easeOut});
        TweenMax.to(chin, 1, {x: 0, y: 0, scaleY: 1, ease: Expo.easeOut});
        TweenMax.to([face, eyebrow], 1, {x: 0, y: 0, skewX: 0, ease: Expo.easeOut});
        TweenMax.to([outerEarL, outerEarR, earHairL, earHairR, hair], 1, {x: 0, y: 0, scaleY: 1, ease: Expo.easeOut});
    }
    
    function getAngle(x1, y1, x2, y2) {
        let angle = Math.atan2(y1 - y2, x1 - x2);
        return angle;
    }
    
    function getPosition(el) {
        let xPos = 0;
        let yPos = 0;
    
        while (el) {
            if (el.tagName === "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                let yScroll = el.scrollTop || document.documentElement.scrollTop;
    
                xPos += (el.offsetLeft - xScroll + el.clientLeft);
                yPos += (el.offsetTop - yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }
    
            el = el.offsetParent;
        }
        return {
            x: xPos,
            y: yPos
        };
    }
    
    useEffect(() => {
        // eslint-disable-next-line
        username = document.querySelector('#username');
        // eslint-disable-next-line
        email = document.querySelector('#email');
        // eslint-disable-next-line
        password = document.querySelector('#password');
        // eslint-disable-next-line
        password2 = document.querySelector('#password2');
        // eslint-disable-next-line
        mySVG = document.querySelector('.svgContainer');armL = document.querySelector('.armL'); armR = document.querySelector('.armR'); eyeL = document.querySelector('.eyeL');eyeR = document.querySelector('.eyeR');nose = document.querySelector('.nose'); mouth = document.querySelector('.mouth'); mouthBG = document.querySelector('.mouthBG'); mouthSmallBG = document.querySelector('.mouthSmallBG');mouthMediumBG = document.querySelector('.mouthMediumBG'); mouthLargeBG = document.querySelector('.mouthLargeBG'); mouthMaskPath = document.querySelector('#mouthMaskPath'); mouthOutline = document.querySelector('.mouthOutline'); tooth = document.querySelector('.tooth'); tongue = document.querySelector('.tongue'); chin = document.querySelector('.chin'); face = document.querySelector('.face'); eyebrow = document.querySelector('.eyebrow'); outerEarL = document.querySelector('.earL .outerEar'); outerEarR = document.querySelector('.earR .outerEar'); earHairL = document.querySelector('.earL .earHair'); earHairR = document.querySelector('.earR .earHair'); hair = document.querySelector('.hair');
        TweenMax.set(armL, {x: -93, y: 220, rotation: 105, transformOrigin: "top left"});
        TweenMax.set(armR, {x: -93, y: 220, rotation: -105, transformOrigin: "top right"});
        username.addEventListener('focus', onElemFocus);
        username.addEventListener('blur', onElemBlur);
        username.addEventListener('input', onElemInput);
        if (email){
            email.addEventListener('focus', onElemFocus);
            email.addEventListener('blur', onElemBlur);
            email.addEventListener('input', onElemInput);
            password2.addEventListener('focus', onPasswordFocus);
            password2.addEventListener('blur', onPasswordBlur);
        }
        password.addEventListener('focus', onPasswordFocus);
        password.addEventListener('blur', onPasswordBlur);    
      return () => {
        username.removeEventListener('focus', onElemFocus);
        username.removeEventListener('blur', onElemBlur);
        username.removeEventListener('input', onElemInput);
        if (email){
            email.removeEventListener('focus', onElemFocus);
            email.removeEventListener('blur', onElemBlur);
            email.removeEventListener('input', onElemInput);
            password2.removeEventListener('focus', onPasswordFocus);
            password2.removeEventListener('blur', onPasswordBlur);
        }
        password.removeEventListener('focus', onPasswordFocus);
        password.removeEventListener('blur', onPasswordBlur);
      }
    }, [active])
    
    
    
    /* -- END  ANIMATION  -- */

    /* -- Page Switcg Animation -- */
    
    const playExpandingAnimation = () => {
        setExpanded(true);
        setTimeout(() => {
          setExpanded(false);
        }, expandingTransition.duration * 1000 - 1500);
      };
    const switchToSignup = () => {
        playExpandingAnimation();
        setTimeout(() => {
            setActive("signup");
        }, 750);
    };
    const switchToSignin = () => {
        playExpandingAnimation();
        setTimeout(() => {
          setActive("signin");
        }, 650);
    };
    /* -- End Page Switcg Animation -- */
    return (
        redirect ? <Navigate to='/' /> :
        <div className='auth-container'>
            <img src={CodingSummitLogo} alt='Coding Summit Logo'></img>
            <Tilt className='auth-tilt' glareEnable={true} glareBorderRadius={"15px"} perspective={2400}>
                <form id='form-auth' onSubmit={(e) => {handleSubmit(e)}}>
                    <div className="svgContainer">
                        <div>
                            <Yeti />
                        </div>
                    </div>
                    <motion.div
                        id='backdrop'
                        initial={false}
                        animate={isExpanded ? "expanded" : "collapsed"}
                        variants={backdropVariants}
                        transition={expandingTransition}
                    />
                    {active==='signin'?<Login switchToSignup={switchToSignup}/>:<Register switchToSignin={switchToSignin}/>}
                </form>
            </Tilt>
        </div>
    )
}
