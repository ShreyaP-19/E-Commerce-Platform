import React, { useEffect, useState } from 'react'
import Header from './Header'
import './addCategory.css'
import axios from 'axios';
import { Link, Route, Routes } from 'react-router-dom';
import BecomeSeller from './BecomeSeller';

function AddCategory() {
    const [name,setname]=useState('');
    const [error,setError]=useState('');
    const [category,setCategory]=useState([]);
    const navigate=useNavigate();

    function handleInputChange(event){
        setname(event.target.value);
    }
    function handleSubmit(e){
        e.preventDefault();
        console.log("Name:",name);
        axios.post('http://localhost:3000/category/add',{name})
        .then((response)=>{
            alert("Successfully added a category");
            setname("");
            navigate('/BecomeSeller')
        })
        .catch((error)=>{
          console.log("Error:",error);
          setname("");
        })
    }

    useEffect(()=>{
      axios.get('http://localhost:3000/category/getAllCategory')
    .then((response)=>{
      if(Array.isArray(response.data) && response.data.length===0){
        setError("No category found");
        setCategory([]);
      }
      else{
        setCategory(response.data);
        setError(null);
      }
      })
      .catch((error) =>{
        console.error("Error fetching categories:", error);
        setCategory([]);  // ✅ Ensure doctors list is cleared on error
        setError("Failed to fetch category. Please try again."); 
    })
    },[])

  return (
    <div>
        <Header/>
        <div id="categoryName">Add a Category</div>
        <div id="label-div">
          <label id="label">Type the name of the category here:</label>
        <input type="text" placeholder='.....' onChange={handleInputChange} value={name} id="input"/>
        <button onClick={handleSubmit} id="saveButton">Save</button>
        </div>
        <div id="category">
        {error?
          (
            <p style={{ color: "red", fontSize: "28px", textAlign: "center" ,marginLeft:"170px"}}>No Categories...</p>
          ) :
          category.length === 0 ? (
            <p style={{ color: "red", fontSize: "28px", textAlign: "center" ,marginLeft:"170px"}}>No Categories...</p>
          ) : (
            category.map((item)=>(
               <Link to={`/category/${item._id}`} key={item._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div  id="categories">
                  <p>{item.name}</p>
                </div>
              </Link>
            ))
          )
        }
      </div>
      <Routes>
        <Route path='/BecomeSeller' element={<BecomeSeller/>}/>
      </Routes>
    </div>
  )
}

export default AddCategory
