import React, { useState, useEffect } from "react";
import { Accordion, Card, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { FaRegCreditCard } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const PaymentPage = () => {
  const { checkoutData = [] } = useSelector((state) => state.cart || {});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "Guest User",
    email: "guest@example.com",
    contact: "0000000000",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserDetails({
        name: storedUser.name || "Guest User",
        email: storedUser.email || "guest@example.com",
        contact: storedUser.phone_number || "0000000000",
      });
    }
  }, []);

  const totalCost = checkoutData.reduce(
    (total, item) => total + item.productPrice * item.quantity,
    0
  );

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const placeOrder = async (userId, addressId, token, paymentStatus, transactionId, paymentMethod) => {
    try {
      // Step 1: Place Order
      const orderResponse = await fetch("http://192.168.1.10:8081/api/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
          totalPrice: totalCost,
          status: "Pending",
          addressId: addressId,
        }),
      });

      const orderResult = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderResult.message || "Failed to place order");

      // Step 2: Create Payment Record
      const paymentResponse = await fetch("http://192.168.1.10:8081/api/payment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          amount: totalCost,
          payment_status: paymentStatus,
          payment_method: paymentMethod,
          transaction_id: transactionId,
        }),
      });

      const paymentResult = await paymentResponse.json();
      if (!paymentResponse.ok) throw new Error(paymentResult.message || "Failed to process payment");

      toast.success("Order & Payment Successful!", { autoClose: 2000 });

      // Clear cart
      localStorage.removeItem("cart");

      // Navigate after short delay
      setTimeout(() => {
        navigate("/orderplacedsuccessfullypage");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const addressId = JSON.parse(localStorage.getItem("addressId"));
      const token = localStorage.getItem("authToken");

      if (!user || !addressId || !token) {
        toast.error("User, Address, or Token missing! Please login again.");
        setIsLoading(false);
        return;
      }

      await placeOrder(userId, addressId, token, "Pending", "COD_NO_TXN", "Cash on Delivery");
    } catch (error) {
      console.error("Error placing COD order:", error);
      toast.error(error.message);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id;
      const addressId = JSON.parse(localStorage.getItem("addressId"));

      if (!user || !addressId || !token) {
        toast.error("User, Address, or Token missing! Please login again.");
        setIsLoading(false);
        return;
      }

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) throw new Error("Failed to load Razorpay SDK.");

      const options = {
        key: "rzp_test_GRRNoJBdPElkDv",
        amount: totalCost * 100,
        currency: "INR",
        name: "Your Store",
        description: "Payment for Order",
        handler: async (response) => {
          await placeOrder(userId, addressId, token, "Paid", response.razorpay_payment_id, "Razorpay");
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.contact,
        },
        theme: { color: "#3399cc" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" />
      <Row>
        <Col>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Payment Method</Accordion.Header>
              <Accordion.Body>
                <Card className="p-4 shadow">
                  <h4><FaRegCreditCard /> Payment Details</h4>
                  <Form className="mt-3">
                    <Form.Check
                      type="radio"
                      label="Cash on Delivery"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={handlePaymentMethodChange}
                      className="mb-3"
                    />
                    <Form.Check
                      type="radio"
                      label="Razorpay"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={handlePaymentMethodChange}
                      className="mb-4"
                    />
                  </Form>

                  {paymentMethod === "cod" && (
                    <Button onClick={handleCashOnDelivery} disabled={isLoading} variant="success" className="w-100">
                      {isLoading ? <Spinner animation="border" size="sm" /> : "Place Order (COD)"}
                    </Button>
                  )}

                  {paymentMethod === "razorpay" && (
                    <Button onClick={handleRazorpayPayment} disabled={isLoading} variant="primary" className="w-100">
                      {isLoading ? <Spinner animation="border" size="sm" /> : "Pay with Razorpay"}
                    </Button>
                  )}
                </Card>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentPage;
