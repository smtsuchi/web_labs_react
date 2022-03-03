import React, { useState, useEffect, useCallback } from 'react';
// import brace from 'brace';
import AceEditor from 'react-ace';
import './Lesson.css';


import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow_night";

import $ from 'jquery';
import { Link, useParams } from 'react-router-dom';
import { FunctionalIFrameComponent } from '../components/IFrameComponent';
import { useCurrentUser, useSetCurrentUser } from '../CurrentUserContext';

export default function Lesson(props) {
    const {coursename, sectionname, lessonname} = useParams()
    const user = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();
    const mode = (coursename==="intro-to-the-world-of-javascript")?'javascript':(coursename === "introduction-to-python")?'python':''
    // const [lesson, setLesson] = useState(props.myCourses.find(element => element.url_path === coursename).sections.find(element => element.url_path === sectionname).lessons.find(element => element.url_path === lessonname))
    const [lesson, setLesson] = useState({
        title: '',
        url: '',
        question: '',
        instructions: '',
        test_case: '',
        assertions:'',
        hints:'',
        checker: '',
        starter_code: '',
    })
    const [nextLesson, setNextLesson] = useState('/')
    const getLesson = useCallback(async () => {
        const res = await fetch(`http://127.0.0.1:8000/lessons/${lessonname}/`);
        const data = await res.json()
        setLesson(data)
      },[lessonname]);
    const getNext = useCallback(async () =>{
        const res = await fetch(`http://127.0.0.1:8000/lessons/string/${sectionname}/`);
        const data = await res.json()
        const thisLessonIndex = data.findIndex(element => element.url_path === lessonname)
        if (thisLessonIndex === data.length-1){
            setNextLesson('/')
        } else {
            setNextLesson(data[thisLessonIndex+1].url_path)
        }
    },[sectionname, lessonname]);
    const updateAssertions = useCallback(() => {
        let obj = {}
        if (lesson.assertions === ''){return obj}
        let temp = lesson.assertions.split('###')
        // console.log('temp', temp)
        for (let i=0; i<temp.length; i++) {
            obj[i] = false
        }
        setAssertions(obj)
    },[lesson]);
    useEffect(()=>{getLesson();getNext()},[getLesson, getNext])
    const [code, setCode] = useState('');
    useEffect(()=>{lesson.starter_code? setCode(lesson.starter_code + '\n'):setCode('')},[lesson.starter_code]);
    useEffect(()=>{updateAssertions()},[updateAssertions])
    const [count, setCount] = useState(0);
    const [response, setResponse] = useState('')
    const [assertions, setAssertions] = useState({})
    const handleUserKeyPress = (event) => {
        if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) { // enter or return
            if (document.querySelector('#modal__container').classList.contains('show')){
                document.getElementById('nextChallengeBtn').click()}
            else {document.querySelector('#run').click()}
        }
        if (event.keyCode === 27) { // escape
            if (document.querySelector('#modal__container').classList.contains('show')){
                document.getElementById('modal__close').click()}
        }
    }
    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        const script = document.createElement('script');
        script.textContent = `const test = () => {
            const assert = (exp) =>{return exp};
            let logs=[];
            console.oldLog = console.log;
            console.log=(val)=>{
                console.oldLog(val); logs.push(val)
            };
            window.addEventListener('message', (e) => {
                if (e.origin !== (window.location.ancestorOrigins['0'])) {
                    console.log('iframe works but not really') ; console.log('origin', e.origin); console.log(window.location.ancestorOrigins['0']); return
                }
                let mainWindow = e.source;
                let data = JSON.parse(e.data)
                let code = data.code;
                let myAssertions = data.assertions;
                let assertions = {};
                let result = '';
                try {
                    logs = [];
                    let useStrict = '"use strict";'
                    result = eval(useStrict + code);
                    result = result == "use strict"?  '': result
                } catch (e) {
                    result = e.toString();
                }
                try {
                    logs = [];
                    let useStrict = '"use strict";'
                    let myAssertionCode = ";let assertionsCS={};for (let i=0;i<myAssertions.length;i++){assertionsCS[i]=eval(myAssertions[i])}; assertionsCS;"
                    assertions = eval(useStrict + code + myAssertionCode)
                    assertions = assertions? assertions: {}
                    //console.oldLog('assertions', assertions)
                } catch (e) {
                    assertions = assertions? assertions: {}
                    console.oldLog('assertion fail', e.toString(), assertions)
                };
                mainWindow.postMessage(JSON.stringify({result, logs, assertions}), e.origin);});
            };
            test();`
        const iframe = document.querySelector('#sandboxed');
        const doc = iframe.contentWindow;
        doc.document.querySelector('body').appendChild(script);
        
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress)
            
        }
    }, [])
    const displayOutput = useCallback((eachLine, returned=false) => {
        let output = ''
        for (let line of eachLine) {
            line = mode==="javascript"?String(JSON.stringify(line)):line
            line = line.replace(/</, '&lt;');
            if (returned){output += `<div>>> ${line}</div>`} else {output += `<div>${line}</div>`}
        }
        $(".output").append(output)
    },[mode]);
    const handleIFrameResponse = useCallback((e) => {
        // Sandboxed iframes which lack the 'allow-same-origin'
        // header have "null" rather than a valid origin. This means you still
        // have to be careful about accepting data via the messaging API you
        // create. Check that source, and validate those inputs!
        var frame = document.getElementById('sandboxed');
        if (e.origin === "http://localhost:3000" && e.source === frame.contentWindow) {
            // console.log('data back', e)
            const data = JSON.parse(e.data)
            if (Object.keys(data.assertions).length === Object.keys(assertions).length) {setAssertions(data.assertions)} else {setAssertions(prevObj => {for (let i=0; i<Object.keys(prevObj).length; i++){prevObj[i]=false}; return prevObj})}
            setResponse(data.result)
            setCount(prevCount => prevCount + 1)
            $(".output").empty()
            if (data.logs) {
                displayOutput(data.logs)
            }
            if (data.result){
                displayOutput([data.result], true)
            }
        }
        },[assertions, displayOutput])
    useEffect(()=>{
        window.addEventListener('message', handleIFrameResponse);
        return () => {window.removeEventListener("message", handleIFrameResponse)}
        },[handleIFrameResponse])

    
    const executeJavaScript = useCallback(() =>{
        
        const evaluate = () => {
            const frame = document.getElementById('sandboxed');
            // console.log(frame)
            // var code = document.getElementById('code').value;
            // Note that we're sending the message to "*", rather than some specific
            // origin. Sandboxed iframes which lack the 'allow-same-origin' header
            // don't have an origin which you can target: you'll have to send to any
            // origin, which might alow some esoteric attacks. Validate your output!
            const sendBody = {
                code: code, 
                assertions: lesson.assertions.split('###')
            }
            frame.contentWindow.postMessage(JSON.stringify(sendBody), '*');
          };
        evaluate()
    },[code, lesson.assertions]);
    const executePython = useCallback(async () => {
        let res = await fetch("https://codingsummit.herokuapp.com/prework/ide/compile/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "language": "python",
                "code": code
            })
        })
        let data = await res.json()
        $(".output").empty()
        setResponse(data);
        let eachLine = data.split('\n')
        displayOutput(eachLine)
    }, [code, displayOutput])
    const executeCode = useCallback(() =>{
        if (mode==="javascript"){executeJavaScript()}
        else if (mode === "python"){executePython()}
    },[mode, executeJavaScript, executePython]);
    
    const closeModal = () => {
        const modal = document.querySelector('#modal__container')
            modal.classList.remove('show')
    }
    const checkReturn = useCallback((val) => {return val === lesson.checker},[lesson]);
    const checkRegEx = useCallback((val) => {
        let vals = val.split('###')
        if (vals[0]===''){
            vals=[]
        }
        const passedList = new Array(vals.length)
        let allPassed = true;
        let re;
        let pattern;
        let flags;
        let indiv;
        let curTest;
        for (let i = 0; i<vals.length; i++) {
            indiv = vals[i].split('##')
            pattern = indiv[0]
            flags = indiv[1]
            re = new RegExp(pattern, flags)
            curTest = re.test(code)
            // console.log('pattern', re)
            // console.log(code)
            // console.log('matches:', code.match(re))
            passedList[i] = curTest
            if (curTest === false) {allPassed=false};
        }
        return {allPassed, passedList}
    },[code]);
    const checkAssertions = useCallback(() => {
        let allPassed = true;
        for (let i = 0; i<Object.keys(assertions).length; i++){
            if (assertions[i] === false) {allPassed = false};
        }
        return allPassed
    },[assertions]);
    const markComplete = useCallback(async () => {
        const res = await fetch("http://127.0.0.1:8000/api/mark-lesson-complete/",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${user.token}`
            },
            body: JSON.stringify({
                "id": lesson.id
            })
        });
        const data = await res.json()
        console.log('response', data)
        setCurrentUser(prevUser => {prevUser.lessons.push(data.lesson); return prevUser})
        return data
    },[lesson, user.token, setCurrentUser]);
    const testCode2 = useCallback((data) => {
        let returnTest = true;
        if (lesson.checker) {returnTest = checkReturn(data)};
        let regexTests = checkRegEx(lesson.test_case);
        let assertionTest = checkAssertions()
        // console.log('regex tests:', regexTests, 'assertion test', assertionTest)
        let hints = document.querySelectorAll('.hints .line')
        for (let i = 0; i<regexTests.passedList.length; i++){
            if (regexTests.passedList[i]) {
                hints[i].classList.remove('failed')
                hints[i].classList.add('passed')
            } else {
                hints[i].classList.remove('passed')
                hints[i].classList.add('failed')
            }
        }
        if (Object.keys(assertions).length>0){
            for (let j = 0; j<Object.keys(assertions).length; j++){
                // console.log(Object.keys(assertions).length, assertions)
                if (assertions[j]) {
                    hints[j+regexTests.passedList.length].classList.remove('failed')
                    hints[j+regexTests.passedList.length].classList.add('passed')
                } else {
                    hints[j+regexTests.passedList.length].classList.remove('passed')
                    hints[j+regexTests.passedList.length].classList.add('failed')
                }
            }
        }
        
            if (regexTests.allPassed && returnTest && assertionTest){
                if (count === 0){return}
                if (user.token){markComplete()}                
                const modal = document.querySelector('#modal__container')
                modal.classList.add('show')
            }
    },[lesson, assertions, count, user.token, checkReturn, checkRegEx, checkAssertions, markComplete]);

    const runIt=useCallback(()=>{testCode2(response)},[testCode2, response])
    useEffect(()=>{runIt()},[count])
    const parseCode = (str, type) => {
        return str.split('\\n').map((line, i) => {
            const splitLine = line.split('\\r')
            if (line[0] === '.') {
                const splitLine = line.split('\\f')
                return (<pre key={`${type}-line-${i}`}><code>{splitLine.map((line, j) => { return (<div key={`${type}-line-${i}-${j}`}>{line.slice(1)}</div>) })}</code></pre>)
            }
            else if (splitLine.length === 1) {
                return (<div className="line" key={`${type}-line-${i}`}>{line}<br /><br/></div>)
            }
            else{
                return (<div className="line" key={`${type}-line-${i}`}>
                    {splitLine.map((portion, j) => {return j%2===0 ? (<span key={`${type}-line-${i}-${j}`}>{portion}</span>): (<code key={`${type}-line-${i}-${j}`}>{portion}</code>)})}
                    <br />
                    <br />
                    </div>)
            }
        }
        )
    }
    return (
        <div className="lesson__main">
            <div className="left">
                <h2>{coursename} | {sectionname}</h2>
                <h3>{lessonname}</h3>
                <div className='lesson__question'>
                    {parseCode(lesson.question, "q")}
                    <hr /><br />
                    {parseCode(lesson.instructions,"i")}
                </div>
                <button id='run' onClick={()=>executeCode()}>Submit</button>
                <div className='hints'>
                    {parseCode(lesson.hints,"h")}
                </div>
            </div>
            <div className='divider'></div>
            <div className="right">
                <div className="ide__main">
                    <AceEditor mode={mode} theme='tomorrow_night' height='70%' width='50%' fontSize="1.25rem" value={code} onChange={setCode} />
                    <div className="output">
                    </div>
                </div>
            </div>
            <FunctionalIFrameComponent style={{display: 'none'}} title="frame" sandbox='allow-scripts allow-same-origin' id='sandboxed'>
            </FunctionalIFrameComponent>
            <div className="modal__container" id="modal__container">
                <div className='modal'>
                    Lesson Completed!
                    <Link id='nextChallengeBtn' className='course-btn' onClick={closeModal} to ={`/re/${coursename}/${sectionname}/${nextLesson}`}>Go to next challenge</Link>
                    <span className="modal__close" id="modal__close" onClick={closeModal}>X</span>
                </div>
            </div>
        </div>
    )
}
