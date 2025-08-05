import React,{useState,useEffect} from 'react'
import './addProduct.css'
import Header from './Header';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import BecomeSeller from './BecomeSeller';

function AddProduct() {
    const {userData}=useAuth();
    const initvalues={name:"",description:"",price:0,stock:0,category:"",owner:userData.existingUser.username}
    const [formValues,setFormValues]=useState(initvalues);
    const [formError,setFormError]=useState({});
    const [isSubmit,setIsSubmit]=useState(false);
    const navigate=useNavigate();
    
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setFormValues({...formValues,[name]:value})
    }

    function handleSubmit(e){
      e.preventDefault();
      const errors=Validate(formValues);
      setFormError(errors);
       if (Object.keys(errors).length === 0) {
        const ProductData = {
          ...formValues,
          productImage: imageData
        };
        console.log("Sending product:", ProductData);
        axios.post("http://localhost:3000/product/add", ProductData)
      .then((res) => {
        alert("Product added successfully!");
        navigate('/BecomeSeller');
      })
      .catch((err) => {
        console.log("Error adding product:", err);
      });
    }
  }

    function Validate(values){
        const errors={};
        if(!values.name){
            errors.name="Name is required"
        }
        if(!values.description){
            errors.description="Description is required"
        }
        if(!values.price){
            errors.price="Price is required"
        }
        if(!values.stock){
            errors.stock="Stock is required"
        }
        if(!values.category){
            errors.category="Category is required"
        }
        return errors;
    }

    const [file, setfile] = useState(null);
    const [imageData, setImageData] = useState(""); // base64
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log(`File selected: ${selectedFile}`);
        if (selectedFile) {
            console.log(`File selected: ${selectedFile.name}`);
            setfile(selectedFile);
    
            const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
          setImageData(reader.result); // Base64 string
        //   console.log("Image url:",imageData)
        };
        } else {
            console.log("Select a file first");
            setfile(null);
            setImageData("");
        }
          console.log("Image url:",imageData)
    }


  return (
    <div>
      <Header/>
      <div id="categoryName">Add a Product</div>
      <div id="label-input">
        <div>
          <label id="label1">Name : </label>
          <input type="text" name="name" value={formValues.name} onChange={handleChange} required id="input1" style={{ borderColor: formError.name ? "red" : "" }}/>
        </div>
        <div>
          <label id="label1">Description : </label>
          <input type="text" name="description" value={formValues.description} onChange={handleChange} required id="input2" style={{ borderColor: formError.description ? "red" : "" }}/>
        </div>
        <div>
          <label id="label1">Price : </label>
          <input type="Number" name="price" value={formValues.price} onChange={handleChange} min={1} required id="input1" style={{ borderColor: formError.price ? "red" : "" }}/>
        </div>
        <div>
          <label id="label1">Stock : </label>
          <input type="Number" name="stock" value={formValues.stock} onChange={handleChange} min={1} required id="input1" style={{ borderColor: formError.stock ? "red" : "" }}/>
        </div>
        <div>
          <label id="label1">Category : </label>
          <input type="text" name="category" value={formValues.category} onChange={handleChange} required id="input1" style={{ borderColor: formError.category ? "red" : "" }}/>
        </div>
        <div>
          <label id="label1">Seller : </label>
          <input type="text" name="owner" value={formValues.owner}  disabled id="input1"/>
        </div>
      
      {/* Come lets add a product */}
        <div>
          <label id="label1">Upload image : </label> 
          <input style={{marginTop:"10px",marginLeft:"2px"}}type="file" accept="image/*" onChange={handleFileChange}/>
        </div>
      </div>
      <div id="save-Button-div"><button onClick={handleSubmit} id="save-Button">Save</button></div>
      <Routes>
        <Route path='/BecomeSeller' element={<BecomeSeller/>}/>
      </Routes>
    </div>
  )
}

export default AddProduct