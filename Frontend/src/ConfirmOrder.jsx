import React from 'react'
import Header from './Header'
import { useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext';

function ConfirmOrder() {
    const location=useLocation();
    const product=location.state?.products;
    console.log(product);
    const {userData}=useAuth();
  return (
    <div>
      <Header/>
      <div id="categoryName">Order Now</div>
      <div id="align-products2">
        <div id="each-product2">
            <div id="photo2"></div>
            <div id="order-div1">HI</div>
            <div id="order-div2">HELLO</div>
        </div>
      </div>
      <button>Add more</button>
    </div>
  )
}

export default ConfirmOrder
