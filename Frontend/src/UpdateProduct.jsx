import React from 'react'
import Header from './Header'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

function UpdateProduct() {
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
  return (
    <div>
      <Header/>
      <div id="categoryName">Update a Product</div>
      <div id="align-products">
        {products.map(product => (
          <Link to={`/update/${product._id}`} key={product._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div id="each-product1">
              <img src={product.productImage}  id="photo1"/>
              {product.name} - ₹{product.price}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UpdateProduct
