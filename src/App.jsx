import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';         // ← aqui
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import Vendas from './pages/Vendas';
import { Container, Row, Col } from 'react-bootstrap';
import './App.css';

export default function App() {
  return (
    <Router>
      <Container fluid className="app-container">
        <Row className="h-100 gx-0">
          {/* Se quiser esconder o sidebar na tela de login,
              você pode condicionar pelo pathname */}
          <Col xs="auto" className="p-0">
            <Sidebar />
          </Col>

          <Col className="p-3 content-area">
            <Routes>
              <Route path="/" element={<Login />} />         {/* ← login em “/” */}
              <Route path="/home" element={<Home />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/vendas"   element={<Vendas />} />
              <Route path="*" element={<h4>Página não encontrada</h4>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}
