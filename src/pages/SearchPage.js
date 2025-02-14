import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartActions';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const { products = [] } = useSelector((state) => state.products);
  const { searchproduct = '' } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const handleAddToCart = async (event, product) => {
    event.stopPropagation();
  
    try {
      const userToken = localStorage.getItem("authToken");
      if (!userToken) {
        alert("Session expired or user not authenticated. Please log in.");
        navigate("/login");
        return;
      }
  
      // Parse the user object from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user.id)
      console.log("User Token:", userToken);

  
      if (!user || !user.id) {
        alert("User information is missing or corrupted. Please log in.");
        navigate("/login");
        return;
      }
  
      const cartItem = {
        user_id: user.id, // Correctly access the parsed user object
        product_id: product.id,
        quantity: 1,
      };  
  
      const response = await fetch("http://192.168.1.12:3000/api/cart/add", {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${userToken}`,
},

        
        body: JSON.stringify(cartItem),
      });
      
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error details:", errorData);
        throw new Error(`Error: ${response.status} - ${errorData.message || response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Cart data added successfully:", data);
      alert("Product successfully added to cart.");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  useEffect(() => {
    if (!searchproduct) return;

    const lowerCaseSearch = searchproduct.toLowerCase();

    const matchingProducts = products.filter(
      (product) => product?.name?.toLowerCase().includes(lowerCaseSearch)
    );

    setFilteredProducts(matchingProducts);
  }, [products, searchproduct]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Search Results:{searchproduct}</h2>
      {filteredProducts.length > 0 ? (
        <div>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              style={{
                display: 'flex',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                alignItems: 'center',
              }}
            >
              {/* Image Section */}
              <div style={{ flex: '1' }}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </div>            
              <div style={{ flex: '3', marginLeft: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                  {product.name}
                </h3>
                <p style={{ color: '#008000', fontWeight: 'bold' }}>₹{product.price}</p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  RAM: {product.ram} | Storage: {product.storage}
                </p>
                <p style={{ color: '#ffa500' }}>{product.ratings} Ratings</p>
                <p style={{ fontSize: '14px', color: '#666' }}>{product.description}</p>
                <p style={{ fontSize: '14px', color: '#666' }}>{products.stock}</p>
                <button
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                  onClick={(e) => handleAddToCart(e, product)}
                  >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No matching products found.</p>
      )}
    </div>
  );
};

export default SearchPage;
