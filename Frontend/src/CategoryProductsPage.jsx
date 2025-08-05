import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header'
import './categoryProductsPage.css'
import { Link } from 'react-router-dom';

function CategoryProductsPage() {
  const { categoryId } = useParams();
  const [products,setProducts]=useState([]);
  const [error,setError]=useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(()=>{
    axios.get(`http://localhost:3000/product/getProductByCategory/${categoryId}`)
    .then((response)=>{
        setProducts(response.data.products);
        setCategoryName(response.data.categoryName);
        console.log(response.data);
        setError(null);
    })
    .catch((err)=>{
        console.error("Error fetching Products:",err);
        setError("Failed to load products of this category");
        setCategoryName('');
        setProducts([]);
    })
  },[categoryId])

  return (
    <div>
      <Header/>
      <div id="categoryName">{categoryName || "..."}</div>
      <div id="align-products">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {products.length === 0 && !error && <p style={{ color: 'red' }}>No products found in this category.</p>}
        {products.map(product => (
          <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div id="each-product">
              {/* <div id="photo"> */}
                <img src={product.productImage}  id="photo1"/>
                {/* </div> */}
              {product.name} - ₹{product.price}
            </div>
          </Link>
        ))}
        {/* <div id="each-product"></div>
        <div id="each-product"></div> */}
      </div>
    </div>
  )
}

export default CategoryProductsPage
