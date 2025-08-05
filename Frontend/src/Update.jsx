import React from 'react'
import Header from './Header'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import BecomeSeller from './BecomeSeller';
function Update() {
    const { productId } = useParams();
    // const [products,setProducts]=useState([]);
    const [error,setError]=useState('');
    const [name,setName]=useState("");
    const [description,setDescription]=useState('');
    const [price,setPrice]=useState("");
    const [stock,setStock]=useState('');
    const [categoryName, setCategoryName] = useState('');
    const [sellerName, setSellerName] = useState('');
    const navigate=useNavigate();
    useEffect(()=>{
        axios.get(`http://localhost:3000/product/getProductById/${productId}`)
    .then((response)=>{
        const product=response.data;
        setName(product.name || '');
        setDescription(product.description || '');
        setPrice(product.price || '');
        setStock(product.stock || '');
        setCategoryName(product.category?.name || '');
        setSellerName(product.owner?.username || '');
        setError(null);
    })
    .catch((err)=>{
        console.error("Error fetching Product:",err);
        setError("Failed to load product");
        // setProducts([]);
    })
  },[productId])

  function handleSubmit(e){
    e.preventDefault();
    const updatedData={};
     if (name !== undefined && name !== '') updatedData.name = name;
    if (description !== undefined && description !== '') updatedData.description = description;
    if (price !== undefined && price !== '') updatedData.price = price;
    if (stock !== undefined && stock !== '') updatedData.stock = stock;

    console.log("Updated data being sent:", updatedData);
    axios.put(`http://localhost:3000/product/updateProduct/${productId}`, updatedData)
    .then((response) => {
      alert("Product updated successfully!");
      console.log("Response:", response.data);
      navigate('/BecomeSeller');

      // optionally redirect or update UI
    })
    .catch((err) => {
      console.error("Failed to update product:", err);
      alert("Failed to update the product. Please try again.");
    });

  }

  return (
    <div>
      <Header/>
      <div id="categoryName">Product Info</div>
      <div id="label-input">
        <div>
            <label id="label1">Name:</label>
            <input value={name} type="text" id="input1" onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
            <label id="label1">Description:</label>
            <input value={description} type="text" id="input1" onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
            <label id="label1">Price:</label>
            <input value={price} type="Number" id="input1" onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
            <label id="label1">Stock:</label>
            <input value={stock} type="Number" id="input1" onChange={(e) => setStock(e.target.value)} />
        </div>
        <div >
            <label id="label1">Category:</label>
            <input value={categoryName} disabled id="input1"/>
        </div>
        <div>
            <label id="label1">Seller:</label>
            <input value={sellerName} disabled id="input1"/>
        </div>
      </div>
      <div id="save-Button-div"><button onClick={handleSubmit} id="save-Button">Update</button></div>
      <Routes>
        <Route path='/BecomeSeller' element={<BecomeSeller/>}/>
      </Routes>
    </div>
  )
}

export default Update
