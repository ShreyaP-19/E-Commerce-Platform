import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import Header from './Header';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Cart() {
    const {userData}=useAuth();
    const userId=userData.existingUser._id;
    const [products,setProducts]=useState([]);
    const [error,setError]=useState(null);
    useEffect(()=>{
        // setUserId(userData.existingUser._id);
        console.log(userId);
        axios.get(`http://localhost:3000/cart/getProducts/${userId}`)
        .then((response)=>{
            setProducts(response.data);
            console.log("Products in cart:",response.data);
            setError(null);
        })
        .catch((err)=>{
            console.error("Error fetching Products:",err);
            setError("Failed to load products in the cart");
        // setCategoryName('');
            setProducts([]);
        })
    },[userId])
    function handleClick(){
        console.log(userId);
    }
    return (
        <div>
            <Header/>
            <div id="categoryName" onClick={handleClick}>Cart</div>
            <div id="align-products">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {products.length === 0 && !error && <p style={{ color: 'red' }}>No products found in this category.</p>}
            {products.map(product => (
            <Link to={`/product/${product.product._id}`} key={product._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div id="each-product1">
              <div id="photo1"><img src={product.product.productImage} id="photo1"/></div>
              {product.product.name} - ₹{product.product.price}
              <p>Quantity : {product.quantity}</p>
            </div>
          </Link>
        ))}
        {/* <div id="each-product"></div>
        <div id="each-product"></div> */}
      </div>
        </div>
    )
}

export default Cart
