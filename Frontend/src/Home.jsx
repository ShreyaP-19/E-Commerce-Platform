import React, { useEffect, useState } from 'react'
import flip from './assets/flip.png'
import './home.css'
import axios from 'axios'
import {Route, Routes, useNavigate} from 'react-router-dom'
import SignUp from './SignUp'
import MainPage from './MainPage'
import { useAuth } from './AuthContext'

function Home() {
    const initvalues={username:"",password:""}
    const [formValue,setFormValue]=useState(initvalues);
    const [formError,setFormError]=useState({});
    const [isSubmit,setIsSubmit]=useState(false);
    const { setIsAuthenticated, setUserData } = useAuth();
    const navigate=useNavigate();

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormValue({...formValue,[name]:value})
    }

    function handleSubmit(e){
        e.preventDefault();
        setFormValue(initvalues);
        const errors=Validate(formValue);
        setFormError(errors);
        if (Object.keys(errors).length===0) {
            console.log("Sending data:",formValue)
            axios.post('http://localhost:3000/auth/login',formValue)
            .then((response)=>{
                console.log("Success:",response.data);
                setIsSubmit(true);
                navigate('/MainPage');
                setIsAuthenticated(true);
                setUserData(response.data);
            })
            .catch((error)=>{
                console.log("Error occured:",error);
            })
        }
    }

    // useEffect(() => {
    //     setFormValue(initvalues);
    //   }, []);

    function Validate(values){
        const errors={}
        //const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!values.username)
            errors.username="Username is required"
        if(!values.password)
            errors.password="Password is required"
        return errors;
    }

  return (
    <div id='hero'>
        <img src={flip} alt="Flipkart" id="flipImg"/>
        <div id="signupbox">
            <h2 id="signin">SIGN IN</h2> 
            <form id="signinform" onSubmit={handleSubmit}>
                <div id="signindiv">
                    <label id="signindiv-label">Username:</label>
                    <input type="text" id="signindiv-input" name="username" onChange={handleChange} value={formValue.username} style={{ borderColor: formError.username ? "red" : "" }}/>
                </div>
                <br/>
                <div id="signindiv">
                    <label id="signindiv-label">Password:</label>
                    <input type="password" id="signindiv-input" name="password" onChange={handleChange} value={formValue.password} style={{ borderColor: formError.password ? "red" : "" }} />
                </div>
                <br/>
                <div id="signindiv-button">
                    <button id="signin-button" type="submit">Submit</button>
                </div>
            </form>
            <p id="create-p">Don't have an account?<span id="create-span" onClick={()=>navigate('/SignUp')}>Create account</span></p>
            <p style={{marginTop:"10px"}}><span id="create-span">Forgot Password?</span></p>
        </div>      
        {isSubmit?
            <Routes>
                <Route path='/SignUp' element={<SignUp/>}/>
                <Route path='/MainPage' element={<MainPage/>}/>
            </Routes>
            :
            <div></div>
            }
    </div>
  )
}

export default Home
