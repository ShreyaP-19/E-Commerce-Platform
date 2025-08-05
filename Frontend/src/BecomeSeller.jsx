import React, { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import AddProduct from './AddProduct';
import Header from './Header';
import './becomeSeller.css';
import axios from 'axios';
import { useAuth } from './AuthContext';
import AddCategory from './AddCategory';
import UpdateProduct from './UpdateProduct';
import UpdateStatus from './UpdateStatus';
import DeleteProduct from './DeleteProduct';
import DeleteCategory from './DeleteCategory';

function BecomeSeller() {
    const {userData}=useAuth();
    const initvalues={username:"",email:"",password:"",role:"admin"}
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
    <div>
      <Header/>
      {/* <button onClick={()=>navigate('/AddProduct')}>Add a Product</button> */}
      {userData.existingUser.role==="customer"? <div>
      {/*<div> */}
      <div id="categoryName" style={{color:"rgb(104, 104, 104)"}}>Ready to become an ENTREPRENEUR?</div>
      <div id="seller-div">
        <p id="div-p">Yesss...You are on the RIGHT path</p>
        <p id="div-p">First of all register to a new account with a new name and details</p>
        <p id="div-p">Then login again with the username and password you gave</p>
        <p id="div-p">And YESSSS.....Then you are an ENTREPRENEURRRR</p>
        <h2 id="click">REGISTER HERE!!!</h2>
      </div>
      <div id="register-box">
        <div id="content"> 
            <h2 id="signin" style={{color:" rgb(94, 77, 94)",marginBottom:"40px"}}>REGISTER</h2>
            <form id="signinform" onSubmit={handleSubmit}>
                <div id="signindiv" style={{marginBottom:"20px"}}>
                    <label id="signindiv-label" style={{color:" rgb(94, 77, 94)"}}>Username:</label>
                    <input type="text" id="signindiv-input" name="username" value={formValues.username} style={{ borderColor: formError.username ? "red" : "" }} onChange={handleChange}></input>
                </div>
                <br/>
                <div id="signindiv" style={{marginBottom:"20px"}}>
                    <label id="signindiv-label" style={{color:" rgb(94, 77, 94)"}}>Email:</label>
                    <input type="email" id="signindiv-input" name="email" value={formValues.email} style={{ borderColor: formError.email ? "red" : "" }} onChange={handleChange}></input>
                </div>
                <br/>
                <div id="signindiv">
                    <label id="signindiv-label" style={{color:" rgb(94, 77, 94)"}}>Password:</label>
                    <input type="password" id="signindiv-input" name="password" value={formValues.password} style={{ borderColor: formError.password ? "red" : "" }} onChange={handleChange}></input>
                </div>
                <br/>
                <div id="signindiv-button">
                    <button id="signin-button" type="submit" style={{backgroundColor:" rgb(94, 77, 94)",marginTop:"20px"}}>Submit</button>
                </div>
            </form>
        </div>
      </div>
      </div>:
      <div>
        <div id="categoryName">What would you like to?</div>
        <div id="divs">
          <div id="div-1" onClick={()=>navigate('/AddCategory')}>Add a category</div>  
          <div id="div-1" onClick={()=>navigate('/AddProduct')}>Add a product</div>
          <div id="div-1" onClick={()=>navigate('/UpdateProduct')}>Update a product</div>
          <div id="div-1" onClick={()=>navigate('/UpdateStatus')}>Update the Status</div>
          <div id="div-1" onClick={()=>navigate('/DeleteProduct')}>Delete a product</div>
          {/* <div id="div-1" onClick={()=>navigate('/DeleteCategory')}>Delete a Category</div> */}
        </div>
      </div>}
      <Routes>
        <Route path="/AddProduct" element={<AddProduct/>}/>
        <Route path='/AddCategory/*' element={<AddCategory/>}/>
        <Route path='/UpdateProduct/*' element={<UpdateProduct/>}/>
        <Route path='/UpdateStatus/*' element={<UpdateStatus/>}/>
        <Route path='/DeleteProduct/*' element={<DeleteProduct/>}/>
        {/* <Route path='/DeleteCategory/*' element={<DeleteCategory/>}/> */}

      </Routes>
    </div>
  )
}

export default BecomeSeller
