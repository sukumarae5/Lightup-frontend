import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { MdPhoneIphone } from "react-icons/md";
import { RiComputerLine } from "react-icons/ri";
import { BsSmartwatch } from "react-icons/bs";
import { CiCamera } from "react-icons/ci";
import { IoHeadsetOutline, IoGameControllerOutline } from "react-icons/io5";

const ProductCategory = () => {
  const { products = [], error = null, loading = false } = useSelector((state) => state.products || {});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null); // Track the active category

  const categoryCardClick = (categoryid) => {
    const filtered = products.filter(
      (product) => String(product.category_id) === String(categoryid)
    );
    setFilteredProducts(filtered);
    setActiveCategory(categoryid); // Set the active category ID
  };

  const categories = [
    {
      categoryicon: <MdPhoneIphone />,
      context: "Phone",
      categoryid: "2",
    },
    {
      categoryicon: <RiComputerLine />,
      context: "Computer",
      categoryid: "",
    },
    {
      categoryicon: <BsSmartwatch />,
      context: "Smartwatch",
      categoryid: "5",
    },
    {
      categoryicon: <CiCamera />,
      context: "Camera",
      categoryid: "3",
    },
    {
      categoryicon: <IoHeadsetOutline />,
      context: "Headphone",
      categoryid: "6",
    },
    {
      categoryicon: <IoGameControllerOutline />,
      context: "Games",
      categoryid: "1",
    },
  ];

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              {categories.map((category, index) => (
                <div
                  key={index}
                  style={{
                    padding: "20px",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    width: "200px",
                    height: "100px",
                    background: activeCategory === category.categoryid ? "red" : "white", // Change background color
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background 0.3s ease",
                  }}
                  onClick={() => categoryCardClick(category.categoryid)}
                >
                  <span
                    style={{
                      fontSize: "40px",
                      display: "block",
                      padding: "10px",
                    }}
                  >
                    {category.categoryicon}
                  </span>
                  <p style={{ margin: 0 }}>{category.context}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            {filteredProducts.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      background: "#f9f9f9",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <h5>{product.name}</h5>
                    <p>Price: ${product.price}</p>
                    <p>Category ID: {product.category_id}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p></p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductCategory;
