import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {fetchWishlistRequest,removeWishlistProductRequest} from "../../features/wishlist/wishlistAction";
import { MdCancel } from "react-icons/md";
import { setSelectedProduct } from "../../features/product/productActions";
import { useNavigate } from "react-router-dom";
import { fetchApiCartDataRequest, fetcheckeoutpagedata } from "../../features/cart/cartActions";

const WishListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlistData = [] } = useSelector((state) => state.wishlist || {});
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  
  const [hoveredCard, setHoveredCard] = useState(null);

 const wishlistItems = Array.isArray(wishlistData[0])
    ? wishlistData[0]
    : wishlistData;
console.log(wishlistData[0])
  useEffect(() => {
    dispatch(fetchWishlistRequest());
  }, [dispatch]);

  const removeItem = (product_id) => {
    console.log(product_id)
    dispatch(removeWishlistProductRequest(product_id));
  };

  const handleCardClick = (productId, product) => {
    dispatch(setSelectedProduct(product));
    navigate("/productpage");
  };
  const handleBuy = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.user_id || "Guest";
    const quantity = 1;
  
    const checkoutItem = [
      {
        userId,
        productId: product.id,
        productName: product.name  || "Unknown",
        productImage: product.image_url || "",
        productPrice: parseFloat(product.price || 0),
        quantity,
        totalPrice: parseFloat(product.price || 0) * quantity,
      },
    ];
  
    dispatch(fetcheckeoutpagedata(checkoutItem));
    navigate("/CheckoutPage");
  };
  const handleAddToCart = async (product_id,product) => {
        
      
        try {
          const userToken = localStorage.getItem("authToken");
          if (!userToken) {
            alert("Session expired or user not authenticated. Please log in.");
            navigate("/login");
            return;
          }
      
          const user = JSON.parse(localStorage.getItem("user"));
          if (!user || !user.id) {
            alert("User information is missing or corrupted. Please log in.");
            navigate("/login");
            return;
          }
      
          
          const isProductInCart = cartItems.some(
            (item) => item.user_id === user.id && item.product_id === product.id
          );  
          if (isProductInCart) {
            alert("Product is already in the cart.");
            return;
          }
          
          const cartItem = {
            user_id: user.id,
            product_id: product_id,
            quantity: 1,
          };
          console.log(cartItem)
      
          // API call to add product to cart
          const response = await fetch("http://192.168.1.12:8081/api/cart/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify(cartItem),
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            alert(`Error: ${data.message || response.statusText}`);
            return;
          }
      
          alert("Product successfully added to cart.");
          dispatch(fetchApiCartDataRequest());
        } catch (error) {
          console.error("Error adding product to cart:", error);
          alert(`Error: ${error.message}`);
        }
      };

  return (
    <div className="container mt-4">
      {wishlistItems.length > 0 ? (
        <div className="row">
          {wishlistItems.map((product, index) => (
            <div key={index} className="col-md-4 col-sm-6 col-12 mb-3">
              <Card
                className="shadow-lg border-0 h-100"
                style={{ background: "#f8f9fa" }}
              >
                <div className="d-flex justify-content-end p-2">
                  <button
                    onClick={() => removeItem(product.wishlist_id)} 
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6e6c6b",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  >
                    <MdCancel />
                  </button>
                </div>

                <Card.Body className="text-center d-flex flex-column justify-content-between">
                  <div
                    onMouseEnter={() => setHoveredCard(product.product_id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleCardClick(product.product_id, product)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      className="d-block w-100 rounded"
                      style={{ height: "200px", objectFit: "cover" }}
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                    />

                    <Card.Title className="text-dark mt-2">
                      {product.name}
                    </Card.Title>

                    <Card.Text className="text-muted small">
                      <strong>Description:</strong>{" "}
                      {product.description?.length > 60
                        ? `${product.description.slice(0, 60)}...`
                        : product.description}
                    </Card.Text>

                    <Card.Text className="text-success font-weight-bold">
                      Price: ₹{product.price}
                    </Card.Text>

                    <Card.Text className="text-secondary">
                      <strong>Stock:</strong> {product.stock}
                    </Card.Text>
                  </div>

                  <div className="d-flex justify-content-center gap-2 mt-2" style={{marginLeft: "20px",
                borderRadius: "8px",
                fontSize: "10px",}}> 
                    <Button variant="outline-danger" 
                    onClick={(event) => handleAddToCart(product.product_id, product)}
                    >Add to Cart</Button>
                    <Button variant="outline-info"
              style={{
                // background: "linear-gradient(135deg,rgb(255, 181, 70), #ff5722)",
                // color: "white",
                padding: "10px 16px",
                marginLeft: "20px",
                borderRadius: "8px",
                fontSize: "16px",
              }}
              onClick={()=>handleBuy(product)}
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted bg-light p-3 rounded shadow">
          No items in wishlist.
        </p>
      )}
    </div>
  );
};

export default WishListPage;