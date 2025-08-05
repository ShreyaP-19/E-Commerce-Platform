import React, { useState } from 'react'
import flip from './assets/flip.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function SignUp() {

    const initvalues={username:"",email:"",password:"",role:"customer"}
    const [formValues,setFormValues]=useState(initvalues);
    const [formError,setFormError]=useState({});
    const [isSubmit,setIsSubmit]=useState(false);
    const navigate=useNavigate();

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormValues({...formValues,[name]:value})
    }

    function handleSubmit(e){
        e.preventDefault();
        const errors=Validate(formValues)
        setFormError(errors);
        if(Object.keys(errors).length===0){
            console.log("sending data:",formValues)
            axios.post('http://localhost:3000/auth/register',formValues)
            .then((response)=>{
                console.log("Success:",response.data);
                setIsSubmit(true);
                navigate('/Home');
                setFormValues(initvalues);
            })
            .catch((error)=>{
                console.log("Error occured:",error);
            })
        }
    }

    function Validate(values){
        const errors={};
        const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!values.username){
            errors.username="Username is required"
        }
        if(!values.password){
            errors.password="Password is required"
        }
        if(!values.email){
            errors.email="Email is required"
        }
        else if (!regex.test(values.email)) {   
            errors.email = "This is not a valid email format!";
        }
        return errors;
    }

  return (
    <div id='hero'>
        <img src={flip} alt="Flipkart" id="flipImg"/>
        <div id="signupbox">
            <h2 id="signin">SIGN UP</h2>
            <form id="signinform" onSubmit={handleSubmit}>
                <div id="signindiv">
                    <label id="signindiv-label">Username:</label>
                    <input type="text" id="signindiv-input" name="username" value={formValues.username} style={{ borderColor: formError.username ? "red" : "" }} onChange={handleChange}></input>
                </div>
                <br/>
                <div id="signindiv">
                    <label id="signindiv-label">Email:</label>
                    <input type="email" id="signindiv-input" name="email" value={formValues.email} style={{ borderColor: formError.email ? "red" : "" }} onChange={handleChange}></input>
                </div>
                <br/>
                <div id="signindiv">
                    <label id="signindiv-label">Password:</label>
                    <input type="password" id="signindiv-input" name="password" value={formValues.password} style={{ borderColor: formError.password ? "red" : "" }} onChange={handleChange}></input>
                </div>
                <br/>
                <div id="signindiv-button">
                    <button id="signin-button" type="submit">Submit</button>
                </div>
            </form>
        </div>

    </div>
  )
}

export default SignUp
