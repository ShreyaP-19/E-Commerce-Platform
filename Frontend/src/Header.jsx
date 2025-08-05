import React,{useState} from 'react'
import "./header.css"
import { useAuth } from './AuthContext'
import { Route, Routes, useNavigate,Link } from 'react-router-dom';
import Profile from './Profile';
import BecomeSeller from './BecomeSeller';
import Cart from './Cart';
import Orders from './Orders';
import axios from 'axios';

function Header() {
  const {userData} = useAuth();
  const navigate=useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  function handleInputChange(event){
    setSearchQuery(event.target.value)
    console.log(event.target.value);
  }
  const handleSearch=async()=>{
    if(!searchQuery.trim()){
      navigate('/MainPage');
      return;
    }
    else{
      try {
        const endpoint = searchQuery.trim()
        ? 'http://localhost:3000/users/search'
        : 'http://localhost:3000/product/getAllProduct';

        const response = await axios.get(endpoint, {params: searchQuery.trim() ? { keyword: searchQuery } : {},
        });

        console.log("Search results:",response.data);
        navigate('/MainPage', { state: { results: response.data, keyword: searchQuery.trim()||"All Products" } });
      } catch (error) {
          console.error("Error fetching search results:",  error);
      }
    }
  }
  function handleClick(){
    console.log("UserDataId:",userData.existingUser._id);
    navigate('/Cart');
  }
  return (
    <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <div id="navbar">
            <div id="logo"></div>
            <div className="searchdiv">
              <div className="nav-search">
                <input className="search-input"
                placeholder="Search" 
                value={searchQuery}
                onChange={handleInputChange} // Capture   input value
                />
                <div className="Sicon">
                  <button className="search-button" onClick={handleSearch}>
                  <i className="fa-solid  fa-magnifying-glass" id="i"></i>
                  </button>
                </div>
              </div>
            </div>
            <i className='fa-solid fa-cloud-arrow-up' id="cart-icon" onClick={()=>navigate('/Orders')}></i>
            <p id="seller-p" onClick={()=>navigate('/Orders')}> Orders</p>
            {/* <Link to={`/cart/${userData.existingUser._id}`} key={userData.existingUser._id} style={{ textDecoration: 'none', color: 'inherit' }}></Link> */}
            <i className='fa-solid fa-cart-shopping' id="cart-icon" onClick={handleClick}></i>
            <p id="seller-p" onClick={handleClick}> Cart</p>
            <i className='fa-solid fa-store' id="shop-icon" onClick={()=>navigate('/BecomeSeller')}></i>
            <p id="seller-p" onClick={()=>navigate('/BecomeSeller')}> Become a seller</p>
            <div id="profile" onClick={()=>navigate('/Profile')}></div>
        </div>
        <Routes>
          <Route path='/Profile' element={<Profile/>}/>
          <Route path='/BecomeSeller' element={<BecomeSeller/>}/>
          <Route path='Cart' element={<Cart/>}/>
          <Route path='Orders' element={<Orders/>}/>
        </Routes>
    </div>
  )
}

export default Header


