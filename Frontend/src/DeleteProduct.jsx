import React from 'react'
import Header from './Header'
import { useAuth } from './AuthContext';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

function DeleteProduct() {
  const {userData}=useAuth();
  const userId=userData.existingUser._id;
  const [products,setProducts]=useState([]);
  useEffect(()=>{
    axios.get(`http://localhost:3000/product/getProductByUserId/${userId}`).then((response)=>{
      setProducts(response.data);
      console.log(response.data);
    })
    .catch((err)=>{
      setProducts([]);
    })
  },[])
  function handleDelete(productId){
    axios.delete(`http://localhost:3000/product/delete/${productId}`)
    .then((response)=>{
      console.log("Deleted Successfully");
      alert("Product deleted successfully");
      window.location.reload();
    })
    .catch((error)=>{
      console.log("Error occured");
      alert("Failed to delete");
    })
  }
  return (
    <div>
      <Header/>
      <div id="categoryName">Delete a Product By Just Clicking it</div>
      <div id="align-products">
        {products.map(product => (
            <div id="each-product1" key={product._id} onClick={()=>handleDelete(product._id)} style={{cursor:"pointer"}}>
              <img src={product.productImage}  id="photo1"/>
              {product.name} - ₹{product.price}
            </div>
        ))}
      </div>
    </div>
  )
}

export default DeleteProduct
