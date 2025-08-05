import React from 'react'
import Home from './Home'
import { Route, Routes } from 'react-router-dom'
import SignUp from './SignUp'
import MainPage from './MainPage'
import Profile from './Profile'
import AddProduct from './AddProduct'
import BecomeSeller from './BecomeSeller'
import CategoryProductsPage from './CategoryProductsPage'
import ProductPage from './ProductPage'
import Cart from './Cart'
import Orders from './Orders'
import ConfirmOrder from './ConfirmOrder'
import AddCategory from './AddCategory'
import UpdateProduct from './UpdateProduct'
import UpdateStatus from './UpdateStatus'
import DeleteProduct from './DeleteProduct'
import DeleteCategory from './DeleteCategory'
import Update from './Update'
function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<Home/>}/>
        <Route path="/SignUp" element={<SignUp/>}/>
        <Route path='/MainPage/*' element={<MainPage/>}/>
        <Route path='/Profile/*' element={<Profile/>}/>
        <Route path='/AddProduct/*' element={<AddProduct/>}/>
        <Route path='/BecomeSeller/*' element={<BecomeSeller/>}/>
        <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/Cart/*" element={<Cart />} />
        <Route path="/Orders/*" element={<Orders />} />
        <Route path='/ConfirmOrder/*' element={<ConfirmOrder/>}/>
        <Route path='/AddCategory/*' element={<AddCategory/>}/>
        <Route path='/UpdateProduct/*' element={<UpdateProduct/>}/>
        <Route path='/UpdateStatus/*' element={<UpdateStatus/>}/>
        <Route path='/DeleteProduct/*' element={<DeleteProduct/>}/>
        <Route path='/DeleteCategory/*' element={<DeleteCategory/>}/>
        <Route path="/update/:productId" element={<Update />} />

      </Routes>

    </div>
  )
}

export default App
