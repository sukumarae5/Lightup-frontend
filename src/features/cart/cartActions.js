export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART_PRODUCT_QUANTITY = "UPDATE_CART_PRODUCT_QUANTITY";

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const updateCartProductQuantity = (productId, quantity) => ({
  type: UPDATE_CART_PRODUCT_QUANTITY,
  payload: { productId, quantity },
});
