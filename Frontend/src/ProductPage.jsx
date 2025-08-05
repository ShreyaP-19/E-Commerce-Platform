import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'
import './productsPage.css'
import { useAuth } from './AuthContext';
import ConfirmOrder from './ConfirmOrder';

function ProductPage() {
    const { productId } = useParams();
    const [products,setProducts]=useState({});
    const [error,setError]=useState(null);
    const [owner,setOwner]=useState('');
    const {userData}=useAuth();
    const userId=userData.existingUser._id;
    const [quantity,setQuantity]=useState('');
    const navigate=useNavigate();
    const [address,setAddress]=useState('');
    useEffect(()=>{
        axios.get(`http://localhost:3000/product/getProductById/${productId}`)
        .then((response)=>{
        setProducts(response.data);
        console.log(response.data);
        console.log("Owner:",response.data.owner.username);
        setOwner(response.data.owner.username)
        setError(null);
    })
    .catch((err)=>{
        console.error("Error fetching Product:",err);
        setError("Failed to load product");
        setProducts([]);
    })
  },[productId]
    )
    function handleChange(e){
        e.preventDefault();
        setQuantity(e.target.value);
    }
    function addToCart(){
        // console.log("Quantity:",quantity);
        // console.log("userId:",userId);
        // console.log("productId:",productId);
        if (!quantity || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        const payload = {
            userId,
            productId,
            quantity: Number(quantity)
        };
        console.log("Data sending:",payload);
        axios.post('http://localhost:3000/cart/addToCart',payload)
        .then((response)=>{
            console.log("Added to cart:", response.data);
            alert("Product added to cart successfully!");
        })
        .catch((error) => {
            console.error("Error adding to cart:", error);
            alert("Failed to add product to cart.");
        });
    }
    function orderNow(){
        if (!quantity || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }
        const enteredAddress= prompt("Enter your address:");
        if (!enteredAddress) {
            alert("Address is required.");
            return;
        } 
        setAddress(enteredAddress)  ;
        const payload = {
            customer: userData.existingUser.username,
            orderItems: [
            {
                product: products.name,
                quantity: Number(quantity),
            },
            ],
            address: enteredAddress,
        };
        console.log("Sending order payload:", payload);
        axios.post('http://localhost:3000/order/add',payload)
        .then((response)=>{
            alert("Order placed successfully!");
            console.log("Order response:",response.data);
        })
        .catch((error)=>{
            console.error("Error placing order:", error);
            alert("Failed to place order.");
        })
    }

    return (
        <div>
            <Header/>
            <div id="maindiv">
                <div id="div1">
                    <img src={products.productImage}  id="image"/>
                </div>
                <div id="div2">
                    <h2 id="product-name">{products.name}</h2>
                    <br/>
                    <p id="product-description">{products.description}</p>
                    <br/>
                    <p style={{color:"rgb(66, 63, 86)"}}>(Seller:{owner} Limited)</p>
                    <br/>
                    <p id="product-name">
                        <i className='fa-solid fa-indian-rupee-sign' style={{marginRight:"10px"}}></i>
                        {products.price}
                    </p>
                    <br/>
                    <div style={{display:"flex",gap:"80px"}}>
                    {products.stock<=1?<p style={{ color: 'red',fontSize:"larger" }}>out of stock</p>:<p style={{ color: 'darkblue',fontSize:"larger" }}>In Stock</p>} 
                    <div>
                        <input type="number" value={quantity} onChange={handleChange} placeholder='Quantity' min="1"></input>
                    </div>
                    </div>
                    <br/>
                    <button id="buyButton" onClick={orderNow}>Buy now</button>
                    <button id="buyButton" onClick={addToCart}>Add to Cart</button>
                </div>
            </div>
            <Routes>
                <Route path='/ConfirmOrder' element={<ConfirmOrder/>}/>
            </Routes>
        </div>
    )
}

export default ProductPage
