// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import Produtos from './pages/Produtos';
import Vendas from './pages/Vendas';
import VendaIncluir from './pages/VendasIncluir';

import './App.css';  // seu CSS de layout

// Componente que decide mostrar/esconder sidebar baseado na rota
function AppContent() {
  const { pathname } = useLocation();
  const showSidebar = pathname !== '/';

  return (
    <Container fluid className="app-container">
      <Row className="h-100 gx-0">
        {showSidebar && (
          <Col xs="auto" className="p-0">
            <Sidebar />
          </Col>
        )}
        <Col className="p-3 content-area">
          <Routes>
            {/* Login e Home */}
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />

            {/* Produtos */}
            <Route path="/produtos" element={<Produtos />} />

            {/* Vendas: listagem, inclusão e edição */}
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/vendas/novo" element={<VendaIncluir />} />
            <Route path="/vendas/:id/edit" element={<VendaIncluir />} />

            {/* Rota não encontrada => redireciona para /vendas */}
            <Route path="*" element={<Navigate to="/vendas" replace />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
}

// App engloba o Router
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
