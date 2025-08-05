import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios'
import { useAuth } from './AuthContext';
import './orders.css'

function Orders() {
    const [order,setOrder]=useState([]);
    const {userData}=useAuth();
    const [error,setError]=useState('');
    const id=userData.existingUser._id;
    useEffect(()=>{
        console.log(id);
        axios.get(`http://localhost:3000/order/getOrderByUser/${id}`)
        .then((response)=>{
            setOrder(response.data);
            console.log(response.data);
            setError(null);
        })
        .catch((err)=>{
            console.error("Error fetching orders:",err);
            setError("Failed to load orders of this user");
            setOrder([]);
        })
    },[id])
    function handleClick(orderId){
        axios.put(`http://localhost:3000/order/cancelOrder/${orderId}`)
        .then((response)=>{
            alert("Order cancelled successfully");
            window.location.reload(); 
        })
        .catch((error) => {
            console.error("Failed to cancel order:", error);
            alert("Failed to cancel the order. Please try again.");
        });
    }
    return (
        <div>
            <Header/>
            <div id="categoryName">Orders</div>
            <div id="align-products2">
                {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
                {order.length === 0 && error && <p style={{ color: 'red' }}>No orders are found.</p>}
                {order.map((orders) => (
                    <div id="each-product2" key={orders._id}>
                        {orders.orderItems.map((item, index) => (
                            <div id="photo2" key={index}><img src={item.product.productImage} alt={item.product.name} style={{ width: '270px', height: '200px', objectFit: 'cover' }}/></div>
                        ))}
                        
                        <div id="order-div1">
                            {orders.orderItems.map((item, index) => (
                                <div key={index}>
                                    <h2 id="orderProductName" style={{marginBottom:"5px"}}>{item.product.name}</h2>
                                    <h3 id="orderProductDesc">{item.product.description}</h3>
                                    <p style={{marginBottom:"5px",color:"rgb(66, 63, 86)"}}>Price - ₹{item.product.price}</p>
                                    <p style={{color:"rgb(66, 63, 86)"}}>Quantity - {item.quantity}</p>
                                </div>
                        ))}
                        </div>
                        <div id="order-div2">
                            <p style={{marginBottom:"10px",color:"rgb(66, 63, 86)"}}>Address - {orders.address}</p>
                            <p style={{marginBottom:"10px",color:"rgb(66, 63, 86)"}}>Total Price - ₹{orders.orderPrice}</p>
                            <h3 style={{color:"rgb(66, 63, 86)"}}>STATUS - {orders.status}</h3>
                            {orders.status==="PENDING"?<button id="cancel" onClick={()=>handleClick(orders._id)}>CANCEL</button>:<div></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders
