import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios'
import { useAuth } from './AuthContext'
function UpdateStatus() {
  const {userData}=useAuth();
  const [order,setOrder]=useState([]);
  // const [sendStatus,setSendStatus]=useState("");
  // const [orderId,setOrderId]=useState("");
  const userId=userData.existingUser._id
  useEffect(()=>{
    axios.get(`http://localhost:3000/order/getOrderOfOwnerProduct/${userId}`)
    .then((response)=>{
      setOrder(response.data);
      console.log(response.data)
    })
    .catch((error)=>{
      setOrder([]);
    })
  },[])
  function handleClick(status,orderId){
    // setSendStatus(status);
    console.log("Status:",status);
    console.log("orderId:",orderId)
    const payload={
      user:userData.existingUser._id,
      sendStatus:status
    }
    axios.put(`http://localhost:3000/order/updateStatus/${orderId}`,payload)
    // console.log("OrderId:",orderId);
    // console.log("payload:",payload);
    .then((response)=>{
      alert("Updated successfully");
      window.location.reload();
    })
    .catch((error)=>{
       alert("Failed to update");
    })
  }
  return (
    <div>
      <Header/>
      <div id="categoryName">Update the Status</div>
      <div id="align-products">
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
                <div>
                  <button id="cancel" style={{backgroundColor:"green"}} onClick={()=>handleClick("deliver",orders._id)}>UPDATE</button>
                  <button id="cancel" onClick={()=>handleClick("cancel",orders._id)} style={{marginLeft:"20px"}}>CANCEL</button>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default UpdateStatus
