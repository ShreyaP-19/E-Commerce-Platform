import React, { useState,useEffect } from 'react'
import Header from './Header'
import './mainPage.css'
import axios from 'axios';
import { useLocation,Link } from "react-router-dom";

function MainPage() {
  const location=useLocation();
  const searchResults=location.state?.results;
  const keyword = location.state?.keyword || '';
  const [category,setCategory]=useState([]);
  const [error,setError]=useState([]);
  const [pError,setpError]=useState([]);
  const [showAll, setShowAll] = useState(false);
  const [products,setProducts]=useState([]);
  function fetchCategory(){
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
    
  }

  function fetchProducts(){
    axios.get('http://localhost:3000/product/getAllProduct')
    .then((response)=>{
      if(Array.isArray(response.data) && response.data.length===0){
        setpError("No Product found");
        setProducts([]);
      }
      else{
        setProducts(response.data);
        setpError(null);
      }
      })
      .catch((error) =>{
        console.error("Error fetching products:", error);
        setProducts([]);  // ✅ Ensure doctors list is cleared on error
        setpError("Failed to fetch products. Please try again."); 
    })
  }

  useEffect(() => {
  if (!searchResults ) {
    fetchProducts();
  } else {
    setProducts(searchResults) // your existing function to load all products
  }
  fetchCategory(); // always load categories
}, [searchResults]);

  // const displayedCategories = showAll ? category : category.slice(0, 5);

  return (
    <div>
      <Header/>
      <div id="below-navbar">
        {error?
          (
            <p style={{ color: "red", fontSize: "28px", textAlign: "center" ,marginLeft:"170px"}}>No Categories...</p>
          ) :
          category.length === 0 ? (
            <p style={{ color: "red", fontSize: "28px", textAlign: "center" ,marginLeft:"170px"}}>No Categories...</p>
          ) : (
            category.map((item)=>(
               <Link to={`/category/${item._id}`} key={item._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div  id="category-list">
                  <p>{item.name}</p>
                </div>
              </Link>
            ))
          )
        }
      </div>
      <div id="align-products1">
          {error && <p style={{ color: 'red' }}>{error}</p>}
        {products.length === 0 && !error && <p style={{ color: 'red' }}>No products found in this category.</p>}
        {products.map(product => (
          <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: 'none', color: 'inherit' }}>
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

export default MainPage
