import React, { useState,useEffect } from 'react'
import { useAuth } from './AuthContext';
import Header from './Header';
import './profile.css'
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { userData, setUserData,logout } = useAuth();
    const [isEnable, setIsEnable] = useState(false);
    const [fullName, setFullName] = useState("");
    // const [email, setEmail] = useState("");
    const [mobileNum, setMobileNum] = useState("");
    const [gender, setGender] = useState(""); // for radio buttons
    const [errorMessage,setErrorMessage]=useState("");
    const navigate=useNavigate();
    const userId=userData.existingUser._id;
    useEffect(() => {
        if (userData?.existingUser) {
            setFullName(userData.existingUser?.fullName || "");
            // setEmail(userData.existingUser.email || "");
            setMobileNum(userData.existingUser?.mobileNum || "");
            setGender(userData.existingUser?.gender || "");
        }
    }, [userData]);

    function handleclick(){
        console.log("User:",userData);
        console.log("Username:",userData.existingUser.username);
        console.log(userData.existingUser.fullName);
    }
    function enableClick(){
        setIsEnable(true);
    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        setErrorMessage("");
        setIsEnable(false);
        const updatedData={};
        if(userData?.existingUser?.fullName!=fullName && fullName!==""){
            updatedData.fullName=fullName;
        }
        // if(userData.existingUser.email!=email && email!==""){
        //     updatedData.email=email;
        // }
        if(userData.existingUser.gender!=gender && gender!==""){
            updatedData.gender=gender;
        }
        if(userData.existingUser.mobileNum!=mobileNum && mobileNum!==""){
            updatedData.mobileNum=mobileNum;
        }
        console.log(updatedData);
        // console.log(userData.existingUser._id)
        try{
            await axios.put(`http://localhost:3000/users/profile/${userData.existingUser._id}`,updatedData);
            setUserData(prev => ({
                ...prev,
                existingUser: {
                    ...prev.existingUser,
                    ...updatedData
                }
            }));

            console.log("Profile updated successfully");
            alert("Profile updated successfully!");
            setIsEnable(false);
            window.location.reload(); 
            // navigate('/MainPage');
        }catch(error){
            console.log("Error:",error);
            setErrorMessage("Failed to update profile.");
        }
    }
    function handleDelete(){
        axios.delete(`http://localhost:3000/users/delete/${userId}`)
        .then((response)=>{
            alert("Your account deleted successfully");
            navigate('/Home');
        })
        .catch((error)=>{
            alert("Failed to delete account");
        })
    }

    function log(){
        logout();
        navigate('/Home');
    }

    return (
    <div>
        <Header/>
        <div id="acc">
        <div id="account-container">
            <div id="sidebar">
                <div id="user-box">
                    <div id="avatar" onClick={handleclick}></div>
                    <p>Hello, <strong>{userData.existingUser.username}</strong></p>
                </div>
            </div>
            <div id="sidebar">
                <div id="section">
                    <p id="section-title"><i className='fa-solid fa-box-open' id="order"></i>MY ORDERS<i className='fa-solid fa-arrow-right' id="arrow"></i></p>
                </div>
            </div>
            <div id="sidebar">
                <div id="section">
                    <p id="section-title"><i className='fa-solid fa-user' id="order"></i>ACCOUNT SETTINGS</p>
                    <ul>
                        <li><a onClick={log}>Log Out</a></li>
                        <li><a onClick={handleDelete}>Delete account</a></li>
                        <li><a>Contact Us</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <form onSubmit={handleSubmit}>
        <div id="profile-info">
            <h2>Personal Information <span id="edit" onClick={enableClick}>Edit</span></h2>
            <div id="edit-input-div">
                <input type="text" placeholder="" value={fullName} id="email-input" disabled={!isEnable}
                onChange={(e) => {
                    setFullName(e.target.value);
                    setErrorMessage(""); 
                  }} required/>
            </div>
            <h2>Your Gender</h2>
            <div id="gender-div">
                <label>Male<input type="radio" name="gender" id="radio" value={"M"}
                checked={gender==="M"} required
                onChange={(e)=>{
                    setGender(e.target.value)
                }} disabled={!isEnable} /> </label>
                <label>Female<input type="radio" name="gender" id="radio" value={"F"}
                checked={gender==="F"}
                onChange={(e)=>{
                    setGender(e.target.value)
                }} disabled={!isEnable}/> </label>
                <label>Other<input type="radio" name="gender" id="radio" value={"O"}
                checked={gender==="O"}
                onChange={(e)=>{
                    setGender(e.target.value)
                }} disabled={!isEnable}/> </label>
            </div>

            <h2>Email Address</h2>
            <input type="email" value={userData.existingUser.email} 
            disabled
            id="email-input" 
            // onChange={(e) => {
                    // setEmail(e.target.value);
                    // setErrorMessage(""); // Clear error when user types
                //   }} required/>
            />
            <h2>Mobile Number</h2>
            <input type="tel" placeholder="" disabled={!isEnable} id="email-input" value={mobileNum}
            onChange={(e) => {
                    setMobileNum(e.target.value);
                    setErrorMessage(""); // Clear error when user types
            }} required />
        </div>
        <button type='submit' id="save" disabled={!isEnable}>Save</button>
        </form>
    </div>
    </div>
  )
}

export default Profile