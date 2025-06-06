import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';
import { fetchApiCartDataRequest } from '../features/cart/cartActions';
import {
  addToWishlistRequest,
  removeWishlistProductRequest,
} from '../features/wishlist/wishlistAction';
import { setSelectedProduct } from '../features/product/productActions';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Custom Alert wrapper
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProductPagenation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const { products = [] } = useSelector((state) => state.products || {});
  const { wishlistData = [] } = useSelector((state) => state.wishlist || {});

  const [currentPage, setCurrentPage] = useState(1);
  const [addedProductIds, setAddedProductIds] = useState([]);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  const showAlert = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const productsPerPage = 6;
  const maxProducts = 36;
  const paginatedProducts = products.slice(0, maxProducts);
  const totalPages = Math.ceil(paginatedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = paginatedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );
  const handlePageChange = (pageNum) => setCurrentPage(pageNum);
  const handleAddToCart = async (event, product) => {
    event.stopPropagation();
    try {
      const userToken = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!userToken || !user?.id) {
        showAlert('Please log in first.', 'warning');
        navigate('/login');
        return;
      }

      const isProductInCart = cartItems.some(
        (item) => item.user_id === user.id && item.product_id === product.id
      );

      const isAlreadyAdded = addedProductIds.includes(product.id);
      if (isProductInCart || isAlreadyAdded) {
        showAlert('Product is already in cart!', 'info');
        return;
      }

      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/cart/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        showAlert(`Error: ${data.message || response.statusText}`, 'error');
        return;
      }

      showAlert('Added to cart!', 'success');
      setAddedProductIds((prev) => [...prev, product.id]);
      dispatch(fetchApiCartDataRequest());
    } catch (error) {
      console.error('Cart error:', error);
      showAlert('An error occurred while adding to cart.', 'error');
    }
  };

  const handleWishlistClick = (e, product, isRemoving) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id || !product?.id) {
      showAlert('Invalid user or product.', 'warning');
      return;
    }

    if (isRemoving) {
      const wishlistItem = wishlistData.find(
        (item) => item.product_id === product.id
      );
      if (wishlistItem) {
        dispatch(removeWishlistProductRequest(wishlistItem.wishlist_id));
        showAlert('Removed from wishlist', 'info');
      }
    } else {
      dispatch(addToWishlistRequest(product.id));
      showAlert('Added to wishlist', 'success');
    }
  };

  const handleCardClick = (id, product) => {
    dispatch(setSelectedProduct(product));
    navigate('/productpage', { state: product });
  };

  const ProductCard = ({ product }) => {
    const isInWishlist = wishlistData.some(
      (item) => item.product_id === product.id
    );

    return (
      <div
        className="card p-2 d-flex flex-column justify-content-between"
        style={{
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          height: '400px',
          cursor: 'pointer',
        }}
        onClick={() => handleCardClick(product.id, product)}
      >
        <div
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 1,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {isInWishlist ? (
            <FaHeart
              color="red"
              onClick={(e) => handleWishlistClick(e, product, true)}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <FaRegHeart
              color="black"
              onClick={(e) => handleWishlistClick(e, product, false)}
              style={{ cursor: 'pointer' }}
            />
          )}

          <FaEye
            color="gray"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(product.id, product);
            }}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <img
          src={product.image_url}
          alt={product.name}
          className="card-img-top"
          style={{
            height: '200px',
            objectFit: 'cover',
            borderRadius: '10px 10px 0 0',
          }}
        />

        <div className="card-body d-flex flex-column justify-content-between p-2">
          <div>
            <h5 className="card-title">{product.name}</h5>
            <p className="card-text">Price: ₹{product.price}</p>
            <p
              className="card-text"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                fontSize: '14px',
              }}
            >
              {product.description}
            </p>
          </div>

          <Button
            variant="dark"
            size="sm"
            className="mt-2"
            style={{ backgroundColor: 'red', borderColor: 'red' }}
            onClick={(e) => handleAddToCart(e, product)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Container className="py-4">
      <Row className="g-3">
        {currentProducts.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={2}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      <div className="text-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            variant={currentPage === i + 1 ? 'primary' : 'outline-secondary'}
            className="mx-1"
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {/* Snackbar Alert */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductPagenation;
