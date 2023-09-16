import React from "react";
import { Col, Row } from "react-bootstrap";
import Login from "./Login";
import Register from "./Register";

export default function Account() {
  return (
    <Row>     
      {/* Login */}
      <Col xs={12} sm={12} md={6} lg={6}>
        <Login />
      </Col>
    </Row>    
  );
}
