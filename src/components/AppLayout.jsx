// src/components/AppLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Container, Row, Col } from 'react-bootstrap';

export default function AppLayout() {
  const { pathname } = useLocation();
  const hideSidebar = pathname === '/login';

  return (
    <Container fluid className="app-container">
      <Row className="h-100 gx-0">
        {!hideSidebar && (
          <Col xs="auto" className="p-0">
            <Sidebar />
          </Col>
        )}
        <Col className="p-3 content-area">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
